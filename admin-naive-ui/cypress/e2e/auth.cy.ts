/**
 * 认证流程 E2E 测试
 *
 * @description
 * 测试登录、登出等认证流程
 *
 * @requirements 12.2, 12.6
 */

describe('认证流程', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('登录页面', () => {
    it('应该正确显示登录表单', () => {
      cy.get('[data-cy="username"]').should('be.visible');
      cy.get('[data-cy="password"]').should('be.visible');
      cy.get('[data-cy="login-button"]').should('be.visible');
    });

    it('应该验证必填字段', () => {
      cy.get('[data-cy="login-button"]').click();
      // 应该显示验证错误
      cy.get('.n-form-item-feedback').should('be.visible');
    });
  });

  describe('登录功能', () => {
    it('应该成功登录', () => {
      cy.get('[data-cy="username"]').type('admin');
      cy.get('[data-cy="password"]').type('admin123');
      cy.get('[data-cy="login-button"]').click();

      // 应该跳转到首页
      cy.url().should('include', '/dashboard');
      // 应该显示用户头像
      cy.get('[data-cy="user-avatar"]').should('be.visible');
    });

    it('应该显示错误消息当密码错误', () => {
      cy.get('[data-cy="username"]').type('admin');
      cy.get('[data-cy="password"]').type('wrongpassword');
      cy.get('[data-cy="login-button"]').click();

      // 应该显示错误消息
      cy.get('.n-message').should('contain', '密码');
      // 应该保持在登录页
      cy.url().should('include', '/login');
    });

    it('应该显示错误消息当用户名不存在', () => {
      cy.get('[data-cy="username"]').type('nonexistent');
      cy.get('[data-cy="password"]').type('password123');
      cy.get('[data-cy="login-button"]').click();

      // 应该显示错误消息
      cy.get('.n-message').should('be.visible');
      cy.url().should('include', '/login');
    });
  });

  describe('登出功能', () => {
    beforeEach(() => {
      // 先登录
      cy.loginByApi('admin', 'admin123');
      cy.visit('/dashboard');
    });

    it('应该成功登出', () => {
      // 点击用户头像
      cy.get('[data-cy="user-avatar"]').click();
      // 点击登出按钮
      cy.get('[data-cy="logout-button"]').click();
      // 确认登出
      cy.get('[data-cy="confirm-button"]').click();

      // 应该跳转到登录页
      cy.url().should('include', '/login');
    });
  });

  describe('认证保护', () => {
    it('未登录时访问受保护页面应该跳转到登录页', () => {
      cy.visit('/system/user');
      cy.url().should('include', '/login');
    });

    it('登录后应该能访问受保护页面', () => {
      cy.loginByApi('admin', 'admin123');
      cy.visit('/system/user');
      cy.url().should('include', '/system/user');
    });
  });
});
