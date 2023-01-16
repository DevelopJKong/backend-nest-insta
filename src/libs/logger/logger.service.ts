import { CONFIG_OPTIONS } from '../../common/common.constants';
import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { LoggerModuleOptions } from './logger.interface';

@Injectable()
export class LoggerService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: LoggerModuleOptions) {}

  logger(): winston.Logger {
    const { combine, timestamp, label, printf } = winston.format;
    //* 로그 파일 저장 경로 → 루트 경로/logs 폴더
    const logDir = `${process.cwd()}/logs`;

    //* log 출력 포맷 정의 함수
    const logFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
    });

    /*
     * Log Level
     * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
     */
    const logger: winston.Logger = winston.createLogger({
      //* 로그 출력 형식 정의
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'NEST-REST-API' }), // 어플리케이션 이름
        logFormat, // log 출력 포맷
        // ? format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게 된다. level이나 message는 콘솔에서 자동 정의
      ),

      //* 실제 로그를 어떻게 기록을 한 것인가 정의
      transports: [
        //* info 레벨 로그를 저장할 파일 설정 (info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
        new winstonDaily({
          level: 'info', // info 레벨
          datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
          dirname: logDir, // 파일 경로
          filename: `%DATE%.log`, // 파일 이름
          maxFiles: 30, // 최근 30일치 로그 파일을 남김
          zippedArchive: true,
        }),
        //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
        new winstonDaily({
          level: 'error', // error 레벨
          datePattern: 'YYYY-MM-DD',
          dirname: logDir + '/error', // /logs/error 하위에 저장
          filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
      //* uncaughtException 발생시 파일 설정
      exceptionHandlers: [
        new winstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: logDir,
          filename: `%DATE%.exception.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    if (this.options.nodeEnv !== 'prod') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
          ),
        }),
      );
    }
    return logger;
  }

  /**
   *  @title 로그 정보 string return 함수
   *  @description 로그 정보를 보다 보기 쉽게 하기 위해서 만든 함수입니다
   *  @param {string | null} custom 사용자 커스텀 메시지
   *  @param {string | null} message 에러 메시지
   *  @param {string | null} name  에러 이름
   *  @param {string | null} stack  에러 스택
   *  @throws {Error}  에러 메시지
   *  @return {string}  최종 메시지
   */
  loggerInfo = (
    custom: string | null = '',
    message: string | null = '',
    name: string | null = '',
    stack: string | null = '',
  ): string => {
    try {
      throw Error(message);
    } catch (error) {
      try {
        const callerLine = error.stack.split('\n')[2];
        const apiNameArray = callerLine.split(' ');
        const apiName = apiNameArray.filter((item: string) => item !== null && item !== undefined && item !== '')[1];

        // ! 의도하지 않은 extraError 일 경우 에러를 던집니다
        if (!callerLine.split('(')[1]) throw new Error(error);

        // * 아래코드는 라인 넘버를 보여주기 위한 코드 입니다
        let LineNumber = callerLine.split('(')[1].split('/').slice(-1)[0].slice(0, -1);

        // * window 환경일 경우 아래 코드를 실행합니다
        if (LineNumber.includes('C:')) LineNumber = `${LineNumber.split('\\').slice(-1)[0]}`;

        const lineNumberText = `Line Number: ${LineNumber} ::: ${apiName} | `;
        const errorMessage = `${error.message ? `Error Message: ${error.message} | ` : ''}`;
        const errorName = `${name ? `Error Name: ${name} | ` : ''}`;
        const errorStack = `${stack ? `Error Stack: ${stack.split('\n')[1].trim()} | ` : ''}`;
        const customMessage = `${custom ? `Custom Message : ${custom}` : ''}`;

        return `${lineNumberText}${errorMessage}${errorName}${errorStack}${customMessage}`;
      } catch (error) {
        // ! 문자열을 자를수 없을 경우 아래 catch문 실행
        const { stack, name } = error;
        return `Error Message: extraError | Error Name: ${name} | Error Stack: ${stack} `;
      }
    }
  };
  successLogger(service: { name: string }, method: string) {
    return this.logger().info(`${service.name} => ${this[`${method}`].name}() | Success Message ::: 데이터 호출 성공`);
  }
}
