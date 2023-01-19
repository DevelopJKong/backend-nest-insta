import { Global, Module, DynamicModule } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsModuleOptions } from './uploads.interface';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Global()
@Module({})
export class UploadsModule {
  static forRoot(options: UploadsModuleOptions): DynamicModule {
    return {
      module: UploadsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        UploadsService,
      ],
      exports: [UploadsService],
    };
  }
}
