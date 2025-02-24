import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { LogMessage } from '../../../../shared/logMessage';
import { ErrorDialogService } from '../services/error-dialog.service';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorDialogService,
    private remoteLoggingService: LoggingService
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    console.error('Error from global error handler', error);

    let errorMessage = '';
    let level = '';
    let stackTrace = '';
    if (error instanceof HttpErrorResponse) {
      errorMessage = 'An HTTP error occured. Status: ' + error.status;
    } else {
      errorMessage = 'This operation resulted in an error';
      stackTrace = error.stack || '';
    }

    this.errorDialogService.openDialog(errorMessage);

    let logMessage: LogMessage = {
      message: errorMessage,
      level: 'error',
      stackTrace: stackTrace,
    };
    this.remoteLoggingService.log(logMessage);
  }
}
