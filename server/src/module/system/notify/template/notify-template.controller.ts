import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotifyTemplateService } from './notify-template.service';
import { CreateNotifyTemplateDto, UpdateNotifyTemplateDto, ListNotifyTemplateDto } from './dto/index';
import { RequirePermission } from 'src/core/decorators/require-premission.decorator';
import { Api } from 'src/core/decorators/api.decorator';
import { NotifyTemplateDetailVo, NotifyTemplateListVo, NotifyTemplateSelectVo } from './vo/index';
import { Operlog } from 'src/core/decorators/operlog.decorator';
import { BusinessType } from 'src/shared/constants/business.constant';
import { UserTool, UserToolType } from '../../user/user.decorator';

@ApiTags('站内信模板管理')
@Controller('system/notify/template')
@ApiBearerAuth('Authorization')
export class NotifyTemplateController {
  constructor(private readonly notifyTemplateService: NotifyTemplateService) {}

  @Api({
    summary: '站内信模板-创建',
    description: '创建新的站内信模板',
    body: CreateNotifyTemplateDto,
  })
  @RequirePermission('system:notify:template:add')
  @Operlog({ businessType: BusinessType.INSERT })
  @Post()
  create(@Body() createDto: CreateNotifyTemplateDto, @UserTool() { injectCreate }: UserToolType) {
    return this.notifyTemplateService.create(injectCreate(createDto));
  }

  @Api({
    summary: '站内信模板-列表',
    description: '分页查询站内信模板列表',
    type: NotifyTemplateListVo,
  })
  @RequirePermission('system:notify:template:list')
  @Get('/list')
  findAll(@Query() query: ListNotifyTemplateDto) {
    return this.notifyTemplateService.findAll(query);
  }

  @Api({
    summary: '站内信模板-下拉选择',
    description: '获取所有启用的站内信模板（用于下拉选择）',
    type: NotifyTemplateSelectVo,
  })
  @RequirePermission('system:notify:template:list')
  @Get('/select')
  getSelectList() {
    return this.notifyTemplateService.getSelectList();
  }

  @Api({
    summary: '站内信模板-详情',
    description: '根据ID获取站内信模板详情',
    type: NotifyTemplateDetailVo,
    params: [{ name: 'id', description: '模板ID', type: 'number' }],
  })
  @RequirePermission('system:notify:template:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifyTemplateService.findOne(+id);
  }

  @Api({
    summary: '站内信模板-更新',
    description: '修改站内信模板信息',
    body: UpdateNotifyTemplateDto,
  })
  @RequirePermission('system:notify:template:edit')
  @Operlog({ businessType: BusinessType.UPDATE })
  @Put()
  update(@Body() updateDto: UpdateNotifyTemplateDto, @UserTool() { injectUpdate }: UserToolType) {
    return this.notifyTemplateService.update(injectUpdate(updateDto));
  }

  @Api({
    summary: '站内信模板-删除',
    description: '批量删除站内信模板，多个ID用逗号分隔',
    params: [{ name: 'id', description: '模板ID，多个用逗号分隔' }],
  })
  @RequirePermission('system:notify:template:remove')
  @Operlog({ businessType: BusinessType.DELETE })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const templateIds = ids.split(',').map((id) => +id);
    return this.notifyTemplateService.remove(templateIds);
  }
}
