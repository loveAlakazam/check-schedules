import React, { useState } from "react";
import "./App.css";

// 예제 데이터
const EXAMPLES = {
  example1: [
    ["2025-08-22T13:43:00.000Z", "2025-08-22T15:54:00.000Z"],
    ["2025-08-22T14:28:00.000Z", "2025-08-22T16:03:00.000Z"],
    ["2025-08-22T16:15:00.000Z", "2025-08-22T21:48:00.000Z"],
    ["2025-08-22T16:55:00.000Z", "2025-08-22T18:55:00.000Z"],
    ["2025-08-22T19:50:00.000Z", "2025-08-22T21:46:00.000Z"],
  ],
  example2: [
    ["2025-09-01T00:00:00.000Z", "2025-09-01T01:00:00.000Z"],
    ["2025-09-01T00:30:00.000Z", "2025-09-01T01:30:00.000Z"],
    ["2025-09-01T02:00:00.000Z", "2025-09-01T03:00:00.000Z"],
  ],
  example3: Array(20).fill([
    "2025-09-01T00:00:00.000Z",
    "2025-09-01T23:59:00.000Z",
  ]),
};

const API_BASE_URL = "http://localhost:3000/api/solutions";

type ApiResult = {
  result: string[];
  executeTime: number;
  comparisons?: number;
};

type ResultsState = {
  naive?: ApiResult;
  optimized?: ApiResult;
} | null;

export default function ScheduleValidator() {
  const [input, setInput] = useState(
    JSON.stringify(EXAMPLES.example1, null, 2)
  );
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResultsState>(null);
  const [loading, setLoading] = useState(false);

  // API 호출 함수
  const callAPI = async (endpoint, schedules) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schedules }),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.statusText}`);
    }

    return await response.json();
  };

  const validateSchedules = async () => {
    setError("");
    setLoading(true);

    try {
      const schedules = JSON.parse(input);

      if (!Array.isArray(schedules) || schedules.length === 0) {
        throw new Error("올바른 배열 형식이 아닙니다.");
      }

      // 두 API를 동시에 호출
      const [naiveResult, optimizedResult] = await Promise.all([
        callAPI("one", schedules),
        callAPI("two", schedules),
      ]);

      setResults({
        naive: naiveResult,
        optimized: optimizedResult,
      });
    } catch (e) {
      setError(e.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (exampleKey) => {
    setInput(JSON.stringify(EXAMPLES[exampleKey], null, 2));
    setError("");
    setResults(null);
  };

  const clearAll = () => {
    setInput("");
    setError("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🗓️ 회의실 스케줄 검증기 (API 버전)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-gray-700">
              <strong className="font-semibold">📌 사용 방법:</strong> JSON 배열
              형식으로 스케줄을 입력하세요.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              🔌 API: <br />
              <code className="bg-gray-200 px-2 py-1 rounded">
                POST {API_BASE_URL}/one
              </code>{" "}
              (Naive),
              <br />
              <code className="bg-gray-200 px-2 py-1 rounded ml-2">
                POST {API_BASE_URL}/two
              </code>{" "}
              (Optimized)
            </p>
          </div>

          {/* 예제 버튼 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => loadExample("example1")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              disabled={loading}
            >
              예제 1 (문제 입력)
            </button>
            <button
              onClick={() => loadExample("example2")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              disabled={loading}
            >
              예제 2 (간단한 예제)
            </button>
            <button
              onClick={() => loadExample("example3")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              disabled={loading}
            >
              예제 3 (최악의 경우)
            </button>
          </div>

          {/* 입력 영역 */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm mb-4 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            disabled={loading}
            placeholder='[\n  ["2025-08-22T13:43:00.000Z", "2025-08-22T15:54:00.000Z"]\n]'
          />

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={validateSchedules}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  검증 중...
                </>
              ) : (
                "🔍 검증하기"
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50"
              disabled={loading}
            >
              🗑️ 초기화
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800">
                <strong className="font-semibold">❌ 오류:</strong> {error}
              </p>
              <p className="text-sm text-red-600 mt-2">
                백엔드 서버가 실행 중인지 확인하세요:{" "}
                <code>http://localhost:3000</code>
              </p>
            </div>
          )}
        </div>

        {/* 결과 */}
        {results && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Naive 방법 결과 */}
            <ResultBox
              title="💡 O(n²) - Naive 방법"
              apiEndpoint="POST /api/solutions/one"
              results={results.naive?.result ?? []}
              time={results.naive?.executeTime ?? -1}
              color="blue"
              comparisons={undefined}
            />

            {/* Optimized 방법 결과 */}
            <ResultBox
              title="⚡ O(n log n) - Sweep Line"
              apiEndpoint="POST /api/solutions/two"
              results={results.optimized?.result ?? []}
              time={results.optimized?.executeTime ?? -1}
              color="green"
              comparisons={undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 결과 박스 컴포넌트
type ResultBoxProps = {
  title: string;
  apiEndpoint: string;
  results?: string[];
  time?: number;
  comparisons?: number;
  color: string;
};

function ResultBox({
  title,
  apiEndpoint,
  results = [],
  time = -1, // 에러발생시 -1 나옴

  color,
}: ResultBoxProps) {
  const borderColor =
    color === "green" ? "border-green-500" : "border-blue-500";
  const textColor = color === "green" ? "text-green-600" : "text-blue-600";
  const bgColor = color === "green" ? "bg-green-50" : "bg-blue-50";

  return (
    <div className={`bg-gray-50 rounded-lg border-l-4 ${borderColor} p-6`}>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <div
        className={`${bgColor} px-3 py-1 rounded text-xs font-mono mb-4 inline-block`}
      >
        {apiEndpoint}
      </div>

      {/* 출력 결과 */}
      <div className="bg-white p-4 rounded-lg font-mono text-sm border border-gray-200 max-h-96 overflow-y-auto mb-4">
        {results.length > 0 ? (
          <pre className="whitespace-pre-wrap">{results.join("\n")}</pre>
        ) : (
          <p className="text-green-600 font-semibold">
            ✅ 겹치는 스케줄이 없습니다.
          </p>
        )}
      </div>

      {/* 메트릭 */}
      <div className="flex justify-around pt-4 border-t border-gray-300">
        <Metric value={time} label="실행 시간 (ms)" color={textColor} />
      </div>
    </div>
  );
}

// 메트릭 컴포넌트
function Metric({ value, label, color }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}
