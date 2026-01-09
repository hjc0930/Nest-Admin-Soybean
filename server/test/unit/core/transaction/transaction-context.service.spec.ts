import { Test, TestingModule } from '@nestjs/testing';
import { TransactionContextService, TransactionContextData } from 'src/core/transaction/transaction-context.service';
import { ClsService } from 'nestjs-cls';

describe('TransactionContextService', () => {
  let service: TransactionContextService;
  let mockClsService: jest.Mocked<ClsService>;
  let clsStore: Map<string, unknown>;

  beforeEach(async () => {
    clsStore = new Map();

    mockClsService = {
      get: jest.fn().mockImplementation((key: string) => clsStore.get(key)),
      set: jest.fn().mockImplementation((key: string, value: unknown) => {
        clsStore.set(key, value);
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionContextService,
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<TransactionContextService>(TransactionContextService);
  });

  afterEach(() => {
    clsStore.clear();
    jest.clearAllMocks();
  });

  describe('isInTransaction', () => {
    it('当没有事务上下文时应返回 false', () => {
      expect(service.isInTransaction()).toBe(false);
    });

    it('当存在事务上下文时应返回 true', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);
      expect(service.isInTransaction()).toBe(true);
    });
  });

  describe('setTransaction', () => {
    it('应正确设置事务上下文', () => {
      const mockClient = {} as any;
      const result = service.setTransaction(mockClient);

      expect(result).toBeDefined();
      expect(result.client).toBe(mockClient);
      expect(result.transactionId).toMatch(/^tx_\d+_[a-z0-9]+$/);
      expect(result.isNested).toBe(false);
      expect(result.startTime).toBeLessThanOrEqual(Date.now());
    });

    it('应正确设置嵌套事务上下文', () => {
      const mockClient1 = { id: 1 } as any;
      const mockClient2 = { id: 2 } as any;

      const parent = service.setTransaction(mockClient1);
      const nested = service.setTransaction(mockClient2, true);

      expect(nested.isNested).toBe(true);
      expect(nested.parentTransactionId).toBe(parent.transactionId);
    });
  });

  describe('getCurrentTransaction', () => {
    it('当没有事务时应返回 undefined', () => {
      expect(service.getCurrentTransaction()).toBeUndefined();
    });

    it('当存在事务时应返回事务上下文', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);

      const current = service.getCurrentTransaction();
      expect(current).toBeDefined();
      expect(current?.client).toBe(mockClient);
    });
  });

  describe('getTransactionClient', () => {
    it('当没有事务时应返回 undefined', () => {
      expect(service.getTransactionClient()).toBeUndefined();
    });

    it('当存在事务时应返回事务客户端', () => {
      const mockClient = { id: 'test-client' } as any;
      service.setTransaction(mockClient);

      expect(service.getTransactionClient()).toBe(mockClient);
    });
  });

  describe('clearTransaction', () => {
    it('应清除事务上下文', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);
      expect(service.isInTransaction()).toBe(true);

      service.clearTransaction();
      expect(service.isInTransaction()).toBe(false);
    });
  });

  describe('suspendTransaction', () => {
    it('当没有事务时应返回 undefined', () => {
      const result = service.suspendTransaction();
      expect(result).toBeUndefined();
    });

    it('应挂起当前事务并返回被挂起的事务', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);
      const transactionId = service.getTransactionId();

      const suspended = service.suspendTransaction();

      expect(suspended).toBeDefined();
      expect(suspended?.transactionId).toBe(transactionId);
      expect(service.isInTransaction()).toBe(false);
    });
  });

  describe('resumeTransaction', () => {
    it('当没有挂起的事务时应返回 undefined', () => {
      const result = service.resumeTransaction();
      expect(result).toBeUndefined();
    });

    it('应恢复被挂起的事务', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);
      const originalTransactionId = service.getTransactionId();

      service.suspendTransaction();
      expect(service.isInTransaction()).toBe(false);

      const resumed = service.resumeTransaction();

      expect(resumed).toBeDefined();
      expect(resumed?.transactionId).toBe(originalTransactionId);
      expect(service.isInTransaction()).toBe(true);
    });

    it('应支持多层事务挂起和恢复', () => {
      const mockClient1 = { id: 1 } as any;
      const mockClient2 = { id: 2 } as any;

      // 设置第一个事务
      service.setTransaction(mockClient1);
      const tx1Id = service.getTransactionId();

      // 挂起第一个事务，设置第二个事务
      service.suspendTransaction();
      service.setTransaction(mockClient2);
      const tx2Id = service.getTransactionId();

      // 挂起第二个事务
      service.suspendTransaction();
      expect(service.isInTransaction()).toBe(false);

      // 恢复第二个事务
      const resumed2 = service.resumeTransaction();
      expect(resumed2?.transactionId).toBe(tx2Id);

      // 清除第二个事务，恢复第一个事务
      service.clearTransaction();
      const resumed1 = service.resumeTransaction();
      expect(resumed1?.transactionId).toBe(tx1Id);
    });
  });

  describe('getTransactionDuration', () => {
    it('当没有事务时应返回 undefined', () => {
      expect(service.getTransactionDuration()).toBeUndefined();
    });

    it('当存在事务时应返回执行时间', async () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);

      // 等待一小段时间
      await new Promise((resolve) => setTimeout(resolve, 10));

      const duration = service.getTransactionDuration();
      expect(duration).toBeDefined();
      expect(duration).toBeGreaterThanOrEqual(10);
    });
  });

  describe('getTransactionId', () => {
    it('当没有事务时应返回 undefined', () => {
      expect(service.getTransactionId()).toBeUndefined();
    });

    it('当存在事务时应返回事务ID', () => {
      const mockClient = {} as any;
      service.setTransaction(mockClient);

      const transactionId = service.getTransactionId();
      expect(transactionId).toBeDefined();
      expect(transactionId).toMatch(/^tx_\d+_[a-z0-9]+$/);
    });
  });
});
