import { Module, Global } from '@nestjs/common';
import { TenantHelper } from './services/tenant.helper';
import { TenantGuard } from './guards/tenant.guard';
import { FeatureToggleService } from './services/feature-toggle.service';
import { RequireFeatureGuard } from './guards/require-feature.guard';
import { TenantExportService } from './services/tenant-export.service';

@Global()
@Module({
  providers: [TenantHelper, TenantGuard, FeatureToggleService, RequireFeatureGuard, TenantExportService],
  exports: [TenantHelper, TenantGuard, FeatureToggleService, RequireFeatureGuard, TenantExportService],
})
export class TenantModule {}
