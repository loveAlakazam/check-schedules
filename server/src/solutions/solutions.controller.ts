import { Body, Controller, Post } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { Schedule } from './schedule.domain';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly service: SolutionsService) {}

  @Post('one')
  solution01(@Body('schedules') schedules: Schedule[]) {
    const startTime= performance.now();
    const result = this.service.handleSolution01(schedules);

    const endTime = performance.now();
    const executeTime = endTime - startTime;
    return {
        result,
        executeTime
    }
  }

  @Post('two')
  solution02(@Body('schedules') schedules : Schedule[] ){    
    const startTime= performance.now();
    const result = this.service.handleSolution02(schedules);

    const endTime = performance.now();
    const executeTime = endTime - startTime;
    return {
        result,
        executeTime
    };
  }
}
