/**
 * Result 类单元测试
 * 测试统一响应结果类的所有方法
 */
import { Result } from '../../../../src/shared/response/result';
import { ResponseCode, ResponseMessage } from '../../../../src/shared/response/response.interface';

describe('Result', () => {
  /**
   * 1.1 Result.ok() 单元测试
   * _Requirements: 3.1_
   */
  describe('Result.ok()', () => {
    it('should return code 200', () => {
      const result = Result.ok();
      expect(result.code).toBe(200);
    });

    it('should return code 200 with data', () => {
      const data = { id: 1, name: 'test' };
      const result = Result.ok(data);
      expect(result.code).toBe(200);
      expect(result.data).toEqual(data);
    });

    it('should correctly pass data of various types', () => {
      // String data
      const stringResult = Result.ok('hello');
      expect(stringResult.data).toBe('hello');

      // Number data
      const numberResult = Result.ok(42);
      expect(numberResult.data).toBe(42);

      // Array data
      const arrayResult = Result.ok([1, 2, 3]);
      expect(arrayResult.data).toEqual([1, 2, 3]);

      // Object data
      const objectResult = Result.ok({ key: 'value' });
      expect(objectResult.data).toEqual({ key: 'value' });

      // Null data
      const nullResult = Result.ok(null);
      expect(nullResult.data).toBeNull();

      // Undefined data (should be null)
      const undefinedResult = Result.ok(undefined);
      expect(undefinedResult.data).toBeNull();
    });

    it('should use default success message when msg is not provided', () => {
      const result = Result.ok({ id: 1 });
      expect(result.msg).toBe(ResponseMessage[ResponseCode.SUCCESS]);
    });

    it('should use custom message when msg is provided', () => {
      const customMsg = '创建成功';
      const result = Result.ok({ id: 1 }, customMsg);
      expect(result.msg).toBe(customMsg);
    });

    it('should return null data when no data is provided', () => {
      const result = Result.ok();
      expect(result.data).toBeNull();
    });
  });

  /**
   * 1.2 Result.fail() 单元测试
   * _Requirements: 3.2_
   */
  describe('Result.fail()', () => {
    it('should return specified error code', () => {
      const result = Result.fail(ResponseCode.USER_NOT_FOUND);
      expect(result.code).toBe(ResponseCode.USER_NOT_FOUND);
    });

    it('should return specified error message', () => {
      const customMsg = '自定义错误消息';
      const result = Result.fail(ResponseCode.BUSINESS_ERROR, customMsg);
      expect(result.msg).toBe(customMsg);
    });

    it('should use default error code when not specified', () => {
      const result = Result.fail();
      expect(result.code).toBe(ResponseCode.BUSINESS_ERROR);
    });

    it('should use default message from ResponseMessage when msg is not provided', () => {
      const result = Result.fail(ResponseCode.USER_NOT_FOUND);
      expect(result.msg).toBe(ResponseMessage[ResponseCode.USER_NOT_FOUND]);
    });

    it('should return null data by default', () => {
      const result = Result.fail(ResponseCode.BUSINESS_ERROR);
      expect(result.data).toBeNull();
    });

    it('should return provided data when specified', () => {
      const errorData = { field: 'username', reason: 'required' };
      const result = Result.fail(ResponseCode.PARAM_INVALID, '参数错误', errorData);
      expect(result.data).toEqual(errorData);
    });

    it('should handle various error codes correctly', () => {
      const authError = Result.fail(ResponseCode.TOKEN_INVALID);
      expect(authError.code).toBe(2001);

      const notFoundError = Result.fail(ResponseCode.DATA_NOT_FOUND);
      expect(notFoundError.code).toBe(1002);

      const permissionError = Result.fail(ResponseCode.PERMISSION_DENIED);
      expect(permissionError.code).toBe(2008);
    });
  });

  /**
   * 1.3 Result.page() 单元测试
   * _Requirements: 3.3_
   */
  describe('Result.page()', () => {
    it('should return correct pagination structure', () => {
      const rows = [{ id: 1 }, { id: 2 }];
      const total = 100;
      const pageNum = 1;
      const pageSize = 10;

      const result = Result.page(rows, total, pageNum, pageSize);

      expect(result.code).toBe(200);
      expect(result.data).not.toBeNull();
      expect(result.data!.rows).toEqual(rows);
      expect(result.data!.total).toBe(total);
      expect(result.data!.pageNum).toBe(pageNum);
      expect(result.data!.pageSize).toBe(pageSize);
    });

    it('should correctly calculate pages field', () => {
      // 100 total, 10 per page = 10 pages
      const result1 = Result.page([], 100, 1, 10);
      expect(result1.data!.pages).toBe(10);

      // 101 total, 10 per page = 11 pages
      const result2 = Result.page([], 101, 1, 10);
      expect(result2.data!.pages).toBe(11);

      // 0 total, 10 per page = 0 pages
      const result3 = Result.page([], 0, 1, 10);
      expect(result3.data!.pages).toBe(0);

      // 5 total, 10 per page = 1 page
      const result4 = Result.page([], 5, 1, 10);
      expect(result4.data!.pages).toBe(1);
    });

    it('should handle empty rows array', () => {
      const result = Result.page([], 0, 1, 10);
      expect(result.data!.rows).toEqual([]);
      expect(result.data!.total).toBe(0);
    });

    it('should handle undefined pageNum and pageSize', () => {
      const result = Result.page([{ id: 1 }], 1);
      expect(result.data!.pageNum).toBeUndefined();
      expect(result.data!.pageSize).toBeUndefined();
      expect(result.data!.pages).toBeUndefined();
    });
  });

  /**
   * 1.4 Result.when() 单元测试
   * _Requirements: 3.4, 3.5_
   */
  describe('Result.when()', () => {
    it('should return success response when condition is true', () => {
      const data = { id: 1, name: 'test' };
      const result = Result.when(true, data);

      expect(result.code).toBe(200);
      expect(result.data).toEqual(data);
    });

    it('should return failure response when condition is false', () => {
      const data = { id: 1, name: 'test' };
      const result = Result.when(false, data);

      expect(result.code).toBe(ResponseCode.OPERATION_FAILED);
      expect(result.data).toBeNull();
    });

    it('should use custom fail code when condition is false', () => {
      const result = Result.when(false, null, ResponseCode.USER_NOT_FOUND);
      expect(result.code).toBe(ResponseCode.USER_NOT_FOUND);
    });

    it('should use custom fail message when condition is false', () => {
      const customMsg = '用户不存在';
      const result = Result.when(false, null, ResponseCode.USER_NOT_FOUND, customMsg);
      expect(result.msg).toBe(customMsg);
    });

    it('should return success with null data when condition is true and data is null', () => {
      const result = Result.when(true, null);
      expect(result.code).toBe(200);
      expect(result.data).toBeNull();
    });
  });

  /**
   * 1.5 Result.fromPromise() 单元测试
   * _Requirements: 3.6, 3.7_
   */
  describe('Result.fromPromise()', () => {
    it('should return success response for resolved Promise', async () => {
      const data = { id: 1, name: 'test' };
      const promise = Promise.resolve(data);

      const result = await Result.fromPromise(promise);

      expect(result.code).toBe(200);
      expect(result.data).toEqual(data);
    });

    it('should return failure response for rejected Promise', async () => {
      const error = new Error('Something went wrong');
      const promise = Promise.reject(error);

      const result = await Result.fromPromise(promise);

      expect(result.code).toBe(ResponseCode.OPERATION_FAILED);
      expect(result.msg).toBe('Something went wrong');
    });

    it('should use custom fail code for rejected Promise', async () => {
      const promise = Promise.reject(new Error('Database error'));

      const result = await Result.fromPromise(promise, ResponseCode.DATABASE_ERROR);

      expect(result.code).toBe(ResponseCode.DATABASE_ERROR);
    });

    it('should handle non-Error rejection', async () => {
      const promise = Promise.reject('string error');

      const result = await Result.fromPromise(promise);

      expect(result.code).toBe(ResponseCode.OPERATION_FAILED);
      expect(result.msg).toBe('操作失败');
    });

    it('should handle Promise resolving to null', async () => {
      const promise = Promise.resolve(null);

      const result = await Result.fromPromise(promise);

      expect(result.code).toBe(200);
      expect(result.data).toBeNull();
    });

    it('should handle Promise resolving to undefined', async () => {
      const promise = Promise.resolve(undefined);

      const result = await Result.fromPromise(promise);

      expect(result.code).toBe(200);
    });
  });

  /**
   * isSuccess() 方法测试
   */
  describe('isSuccess()', () => {
    it('should return true for success response', () => {
      const result = Result.ok({ id: 1 });
      expect(result.isSuccess()).toBe(true);
    });

    it('should return false for failure response', () => {
      const result = Result.fail(ResponseCode.BUSINESS_ERROR);
      expect(result.isSuccess()).toBe(false);
    });
  });
});
