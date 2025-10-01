import { Schedule } from './schedule.domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SolutionsService {
  handleSolution01(schedules: Schedule[]) {
    const results :string[]= [];

    // 모든 스케줄쌍(시작일시,종료일시)들을 비교합니다.
    for(let i=0; i<schedules.length; i++) {
        for(let j=i+1; j<schedules.length; j++) {
            const [start_i, end_i] = schedules[i].map(d => new Date(d));
            const [start_j, end_j] = schedules[j].map(d => new Date(d));
            
            // 겹치는 구간이 있는지 확인합니다.
            if(start_i < end_j && start_j < end_i) {
                // 겹치는 구간을 계산 합니다.
                const overlapStart = new Date(Math.max(start_i.getTime(), start_j.getTime())); 
                const overlapEnd = new Date(Math.min(end_i.getTime(), end_j.getTime()));
                
                // 결과리스트에 겹치는 구간을 넣습니다.
                results.push(`${i}번 vs ${j}번 : ${overlapStart.toISOString()} ~ ${overlapEnd.toISOString()}`);
            }
        }
    }
    
    return results;
  }

  handleSolution02(schedules: Schedule[]) {
    // 시작시각 기준으로 인덱스와 함께 정렬합니다.
    const sortedSchedules = schedules.map((schedule, i) =>({
        index: i,
        start: new Date(schedule[0]),
        end: new Date(schedule[1]),
    })).sort((a, b) => a.start.getTime() - b.start.getTime());

    const results :string[] = [];

    // 시작시간을 기준으로 정렬을 했으므로
    // next.start >= curr.end 조건해당되는 스케줄과 그 이후의 스케줄들은 넘어갑니다.
    for(let i=0; i<sortedSchedules.length; i++) {
        // 현재 스케줄: indexed[i]
        const curr = sortedSchedules[i];
        
        // 비교 스케줄: indexed[j]
        for(let j=i+1; j<sortedSchedules.length; j++) {
          const next = sortedSchedules[j];

          // 겹치는 시간이 없고, 이후스케줄과 더이상 비교할 필요 없습니다.        
          if(next.start >= curr.end) break;

          // 겹치는 스케줄시간 인지 확인합니다.
          if(next.start < curr.end && curr.start < next.end) {

            // 겹치는 스케줄시간
            const overlapStart = new Date(Math.max(curr.start.getTime(), next.start.getTime()));
            const overlapEnd = new Date(Math.min(curr.end.getTime(), next.end.getTime()));

            // 인덱스를 비교합니다.
            const [firstIdx, secondIdx] = curr.index < next.index ? [curr.index, next.index] : [next.index, curr.index];

            results.push(`${firstIdx}번 vs ${secondIdx}번 : ${overlapStart.toISOString()} ~ ${overlapEnd.toISOString()}`)
          }
        }
    }

    return results;
  }
}
