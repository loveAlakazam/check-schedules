import { Test, TestingModule } from '@nestjs/testing';
import { SolutionsService } from './solutions.service';
import { Schedule } from './schedule.domain';

describe('SolutionsService', () => {
  let service: SolutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolutionsService],
    }).compile();

    service = module.get<SolutionsService>(SolutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleSolution01', () => {
    it('겹치는 스케줄 1개가 존재한다', () => {
      // given
      const schedules: Schedule[] = [
        // [ 시작일시, 종료일시 ]
        ['2025-09-01T00:00:00.000Z', '2025-09-01T01:00:00.000Z'],
        ['2025-09-01T00:30:00.000Z', '2025-09-01T01:30:00.000Z'],
        ['2025-09-01T02:00:00.000Z', '2025-09-01T03:00:00.000Z'],
      ];
      const expectedResult = [
        '0번 vs 1번 : 2025-09-01T00:30:00.000Z ~ 2025-09-01T01:00:00.000Z',
      ];

      // when
      const result = service.handleSolution01(schedules);

      // then
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(expectedResult[0]);
    });
    it('겹치는 스케줄 3개가 존재한다.', () => {
      // given
      const schedules: Schedule[] = [
        ['2025-08-22T13:43:00.000Z', '2025-08-22T15:54:00.000Z'],
        ['2025-08-22T14:28:00.000Z', '2025-08-22T16:03:00.000Z'],
        ['2025-08-22T16:15:00.000Z', '2025-08-22T21:48:00.000Z'],
        ['2025-08-22T16:55:00.000Z', '2025-08-22T18:55:00.000Z'],
        ['2025-08-22T19:50:00.000Z', '2025-08-22T21:46:00.000Z'],
      ];
      const expectedResult = [
        '0번 vs 1번 : 2025-08-22T14:28:00.000Z ~ 2025-08-22T15:54:00.000Z',
        '2번 vs 3번 : 2025-08-22T16:55:00.000Z ~ 2025-08-22T18:55:00.000Z',
        '2번 vs 4번 : 2025-08-22T19:50:00.000Z ~ 2025-08-22T21:46:00.000Z',
      ];

      // when
      const result = service.handleSolution01(schedules);

      // then
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(expectedResult[0]);
      expect(result[1]).toBe(expectedResult[1]);
      expect(result[2]).toBe(expectedResult[2]);
    });
  });
  describe('handleSolution02', () => {
    it('겹치는 스케줄 1개가 존재한다', () => {
      // given
      const schedules: Schedule[] = [
        // [ 시작일시, 종료일시 ]
        ['2025-09-01T00:00:00.000Z', '2025-09-01T01:00:00.000Z'],
        ['2025-09-01T00:30:00.000Z', '2025-09-01T01:30:00.000Z'],
        ['2025-09-01T02:00:00.000Z', '2025-09-01T03:00:00.000Z'],
      ];
      const expectedResult = [
        '0번 vs 1번 : 2025-09-01T00:30:00.000Z ~ 2025-09-01T01:00:00.000Z',
      ];

      // when
      const result = service.handleSolution02(schedules);

      // then
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(expectedResult[0]);
    });
    it('겹치는 스케줄 3개가 존재한다.', () => {
      // given
      const schedules: Schedule[] = [
        ['2025-08-22T13:43:00.000Z', '2025-08-22T15:54:00.000Z'],
        ['2025-08-22T14:28:00.000Z', '2025-08-22T16:03:00.000Z'],
        ['2025-08-22T16:15:00.000Z', '2025-08-22T21:48:00.000Z'],
        ['2025-08-22T16:55:00.000Z', '2025-08-22T18:55:00.000Z'],
        ['2025-08-22T19:50:00.000Z', '2025-08-22T21:46:00.000Z'],
      ];
      const expectedResult = [
        '0번 vs 1번 : 2025-08-22T14:28:00.000Z ~ 2025-08-22T15:54:00.000Z',
        '2번 vs 3번 : 2025-08-22T16:55:00.000Z ~ 2025-08-22T18:55:00.000Z',
        '2번 vs 4번 : 2025-08-22T19:50:00.000Z ~ 2025-08-22T21:46:00.000Z',
      ];

      // when
      const result = service.handleSolution02(schedules);

      // then
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(expectedResult[0]);
      expect(result[1]).toBe(expectedResult[1]);
      expect(result[2]).toBe(expectedResult[2]);
    });
    it('겹치는 스케줄 2개가 존재한다.', () => {
      // given
      const schedules: Schedule[] = [
        ['2025-08-22T14:28:00.000Z', '2025-08-22T16:03:00.000Z'],
        ['2025-08-22T19:50:00.000Z', '2025-08-22T21:46:00.000Z'],
        ['2025-08-22T13:43:00.000Z', '2025-08-22T15:54:00.000Z'],
        ['2025-08-22T16:15:00.000Z', '2025-08-22T21:48:00.000Z'],
      ];
      const expectedResult = [
        '0번 vs 2번 : 2025-08-22T14:28:00.000Z ~ 2025-08-22T15:54:00.000Z',
        '1번 vs 3번 : 2025-08-22T19:50:00.000Z ~ 2025-08-22T21:46:00.000Z',
      ];

      // when
      const result = service.handleSolution02(schedules);

      // then
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(expectedResult[0]);
      expect(result[1]).toBe(expectedResult[1]);
    });
  });
});
