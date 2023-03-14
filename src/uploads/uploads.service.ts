require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import * as AWS from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadsModuleOptions } from './uploads.interface';
import { FileUpload } from 'src/common/common.interface';

@Injectable()
export class UploadsService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: UploadsModuleOptions) {}

  async uploadFile(file: Promise<FileUpload>, userId: number, folderName: string) {
    try {
      const BUCKET_NAME = this.options.bucketName;
      AWS.config.update({
        credentials: {
          accessKeyId: this.options.accessKeyId,
          secretAccessKey: this.options.secretAccessKey,
        },
      });
      const { filename, createReadStream } = await file;

      const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
      const readStream = createReadStream();
      const { Location } = await new AWS.S3()
        .upload({
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
          Body: readStream,
        })
        .promise();

      return Location;
    } catch (error) {
      return null;
    }
  }
}
