-- AlterTable
ALTER TABLE "gen_table" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "gen_table_column" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_client" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_config" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_dept" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_dict_data" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_dict_type" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_file_folder" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_file_share" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_job" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_job_log" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_logininfor" ALTER COLUMN "login_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_menu" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_notice" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_oper_log" ALTER COLUMN "oper_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_post" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_role" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_system_config" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_tenant" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_tenant_package" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_upload" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sys_user" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "sys_sms_channel" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "signature" VARCHAR(100) NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "api_secret" VARCHAR(255) NOT NULL,
    "callback_url" VARCHAR(500),
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) NOT NULL DEFAULT '',
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "sys_sms_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_sms_template" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "params" TEXT,
    "api_template_id" VARCHAR(100) NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) NOT NULL DEFAULT '',
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "sys_sms_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_sms_log" (
    "id" BIGSERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "channel_code" VARCHAR(50) NOT NULL,
    "template_id" INTEGER NOT NULL,
    "template_code" VARCHAR(100) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "params" TEXT,
    "send_status" INTEGER NOT NULL DEFAULT 0,
    "send_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receive_status" INTEGER,
    "receive_time" TIMESTAMP(6),
    "api_send_code" VARCHAR(100),
    "api_receive_code" VARCHAR(100),
    "error_msg" TEXT,

    CONSTRAINT "sys_sms_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_mail_account" (
    "id" SERIAL NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "host" VARCHAR(255) NOT NULL,
    "port" INTEGER NOT NULL,
    "ssl_enable" BOOLEAN NOT NULL DEFAULT false,
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) NOT NULL DEFAULT '',
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "sys_mail_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_mail_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "account_id" INTEGER NOT NULL,
    "nickname" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "params" TEXT,
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) NOT NULL DEFAULT '',
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "sys_mail_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_mail_log" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER,
    "user_type" INTEGER,
    "to_mail" VARCHAR(255) NOT NULL,
    "account_id" INTEGER NOT NULL,
    "from_mail" VARCHAR(255) NOT NULL,
    "template_id" INTEGER NOT NULL,
    "template_code" VARCHAR(100) NOT NULL,
    "template_nickname" VARCHAR(100) NOT NULL,
    "template_title" VARCHAR(255) NOT NULL,
    "template_content" TEXT NOT NULL,
    "template_params" TEXT,
    "send_status" INTEGER NOT NULL DEFAULT 0,
    "send_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_msg" TEXT,

    CONSTRAINT "sys_mail_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_notify_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "params" TEXT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) NOT NULL DEFAULT '',
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "sys_notify_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_notify_message" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" VARCHAR(20) NOT NULL DEFAULT '000000',
    "user_id" INTEGER NOT NULL,
    "user_type" INTEGER NOT NULL DEFAULT 1,
    "template_id" INTEGER NOT NULL,
    "template_code" VARCHAR(100) NOT NULL,
    "template_nickname" VARCHAR(100) NOT NULL,
    "template_content" TEXT NOT NULL,
    "template_params" TEXT,
    "read_status" BOOLEAN NOT NULL DEFAULT false,
    "read_time" TIMESTAMP(6),
    "del_flag" CHAR(1) NOT NULL DEFAULT '0',
    "create_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_notify_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_tenant_quota" (
    "id" SERIAL NOT NULL,
    "tenant_id" VARCHAR(20) NOT NULL,
    "user_quota" INTEGER NOT NULL DEFAULT -1,
    "user_used" INTEGER NOT NULL DEFAULT 0,
    "storage_quota" BIGINT NOT NULL DEFAULT -1,
    "storage_used" BIGINT NOT NULL DEFAULT 0,
    "api_quota" INTEGER NOT NULL DEFAULT -1,
    "api_used" INTEGER NOT NULL DEFAULT 0,
    "create_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sys_tenant_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_tenant_quota_log" (
    "id" SERIAL NOT NULL,
    "tenant_id" VARCHAR(20) NOT NULL,
    "quota_type" VARCHAR(50) NOT NULL,
    "old_value" BIGINT NOT NULL,
    "new_value" BIGINT NOT NULL,
    "change_by" VARCHAR(64) NOT NULL,
    "change_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_tenant_quota_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_tenant_billing" (
    "id" SERIAL NOT NULL,
    "bill_no" VARCHAR(50) NOT NULL,
    "tenant_id" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "cycle" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "due_date" TIMESTAMP(6) NOT NULL,
    "paid_time" TIMESTAMP(6),
    "remark" VARCHAR(500),
    "create_by" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sys_tenant_billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_tenant_billing_item" (
    "id" SERIAL NOT NULL,
    "billing_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" VARCHAR(500),

    CONSTRAINT "sys_tenant_billing_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_tenant_audit_log" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" VARCHAR(20) NOT NULL,
    "operator_id" INTEGER NOT NULL,
    "operator_name" VARCHAR(50) NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "action_desc" VARCHAR(500) NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "ip_address" VARCHAR(128) NOT NULL,
    "user_agent" VARCHAR(500),
    "request_url" VARCHAR(500),
    "request_method" VARCHAR(10),
    "request_params" TEXT,
    "before_data" TEXT,
    "after_data" TEXT,
    "response_data" TEXT,
    "operate_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_tenant_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_sms_channel_code_key" ON "sys_sms_channel"("code");

-- CreateIndex
CREATE INDEX "sys_sms_channel_status_idx" ON "sys_sms_channel"("status");

-- CreateIndex
CREATE INDEX "sys_sms_channel_code_idx" ON "sys_sms_channel"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_sms_template_code_key" ON "sys_sms_template"("code");

-- CreateIndex
CREATE INDEX "sys_sms_template_channel_id_idx" ON "sys_sms_template"("channel_id");

-- CreateIndex
CREATE INDEX "sys_sms_template_status_idx" ON "sys_sms_template"("status");

-- CreateIndex
CREATE INDEX "sys_sms_template_type_idx" ON "sys_sms_template"("type");

-- CreateIndex
CREATE INDEX "sys_sms_log_mobile_idx" ON "sys_sms_log"("mobile");

-- CreateIndex
CREATE INDEX "sys_sms_log_send_time_idx" ON "sys_sms_log"("send_time");

-- CreateIndex
CREATE INDEX "sys_sms_log_send_status_idx" ON "sys_sms_log"("send_status");

-- CreateIndex
CREATE INDEX "sys_sms_log_template_code_idx" ON "sys_sms_log"("template_code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_mail_account_mail_key" ON "sys_mail_account"("mail");

-- CreateIndex
CREATE INDEX "sys_mail_account_status_idx" ON "sys_mail_account"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sys_mail_template_code_key" ON "sys_mail_template"("code");

-- CreateIndex
CREATE INDEX "sys_mail_template_account_id_idx" ON "sys_mail_template"("account_id");

-- CreateIndex
CREATE INDEX "sys_mail_template_status_idx" ON "sys_mail_template"("status");

-- CreateIndex
CREATE INDEX "sys_mail_log_to_mail_idx" ON "sys_mail_log"("to_mail");

-- CreateIndex
CREATE INDEX "sys_mail_log_send_time_idx" ON "sys_mail_log"("send_time");

-- CreateIndex
CREATE INDEX "sys_mail_log_send_status_idx" ON "sys_mail_log"("send_status");

-- CreateIndex
CREATE INDEX "sys_mail_log_template_code_idx" ON "sys_mail_log"("template_code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_notify_template_code_key" ON "sys_notify_template"("code");

-- CreateIndex
CREATE INDEX "sys_notify_template_status_idx" ON "sys_notify_template"("status");

-- CreateIndex
CREATE INDEX "sys_notify_template_type_idx" ON "sys_notify_template"("type");

-- CreateIndex
CREATE INDEX "sys_notify_message_tenant_id_user_id_idx" ON "sys_notify_message"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "sys_notify_message_user_id_read_status_idx" ON "sys_notify_message"("user_id", "read_status");

-- CreateIndex
CREATE INDEX "sys_notify_message_create_time_idx" ON "sys_notify_message"("create_time");

-- CreateIndex
CREATE UNIQUE INDEX "sys_tenant_quota_tenant_id_key" ON "sys_tenant_quota"("tenant_id");

-- CreateIndex
CREATE INDEX "sys_tenant_quota_tenant_id_idx" ON "sys_tenant_quota"("tenant_id");

-- CreateIndex
CREATE INDEX "sys_tenant_quota_log_tenant_id_idx" ON "sys_tenant_quota_log"("tenant_id");

-- CreateIndex
CREATE INDEX "sys_tenant_quota_log_change_time_idx" ON "sys_tenant_quota_log"("change_time");

-- CreateIndex
CREATE UNIQUE INDEX "sys_tenant_billing_bill_no_key" ON "sys_tenant_billing"("bill_no");

-- CreateIndex
CREATE INDEX "sys_tenant_billing_tenant_id_idx" ON "sys_tenant_billing"("tenant_id");

-- CreateIndex
CREATE INDEX "sys_tenant_billing_status_idx" ON "sys_tenant_billing"("status");

-- CreateIndex
CREATE INDEX "sys_tenant_billing_due_date_idx" ON "sys_tenant_billing"("due_date");

-- CreateIndex
CREATE INDEX "sys_tenant_billing_create_time_idx" ON "sys_tenant_billing"("create_time");

-- CreateIndex
CREATE INDEX "sys_tenant_billing_item_billing_id_idx" ON "sys_tenant_billing_item"("billing_id");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_tenant_id_idx" ON "sys_tenant_audit_log"("tenant_id");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_operator_id_idx" ON "sys_tenant_audit_log"("operator_id");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_action_type_idx" ON "sys_tenant_audit_log"("action_type");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_operate_time_idx" ON "sys_tenant_audit_log"("operate_time");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_tenant_id_operate_time_idx" ON "sys_tenant_audit_log"("tenant_id", "operate_time");

-- CreateIndex
CREATE INDEX "sys_tenant_audit_log_tenant_id_action_type_operate_time_idx" ON "sys_tenant_audit_log"("tenant_id", "action_type", "operate_time");

-- AddForeignKey
ALTER TABLE "sys_sms_template" ADD CONSTRAINT "sys_sms_template_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "sys_sms_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_mail_template" ADD CONSTRAINT "sys_mail_template_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "sys_mail_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_tenant_billing_item" ADD CONSTRAINT "sys_tenant_billing_item_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "sys_tenant_billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
