// src/components/PopulationGraph.tsx
import { useEffect, useState } from 'react';
import { fetchPopulation } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PopulationValue = {
  year: number;
  value: number;
};

type PopulationData = {
  year: number;
  [prefName: string]: number;
};

type Props = {
  selectedPrefectures: Prefecture[];
  populationLabel: string;
};

export default function PopulationGraph({ selectedPrefectures, populationLabel }: Props) {
  const [graphData, setGraphData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPrefectures.length === 0) {
      setGraphData([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          selectedPrefectures.map(async (pref) => {
            const res = await fetchPopulation(pref.prefCode);
            const target = res.data.find((item: { label: string }) => item.label === populationLabel);
            return {
              prefName: pref.prefName,
              data: (target?.data ?? []) as PopulationValue[],
            };
          })
        );

        const merged: { [year: number]: PopulationData } = {};

        for (const result of results) {
          const { prefName, data } = result;
          data.forEach((item) => {
            if (!merged[item.year]) {
              merged[item.year] = { year: item.year };
            }
            merged[item.year][prefName] = item.value;
          });
        }

        const formatted = Object.values(merged).sort((a, b) => a.year - b.year);
        setGraphData(formatted);
      } catch (error) {
        console.error('人口データの取得に失敗しました:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [selectedPrefectures, populationLabel]);

  return (
    <div>
      <h2>人口推移グラフ（{populationLabel}）</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : graphData.length === 0 ? (
        <p>都道府県を選択してください</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
  <LineChart
    data={graphData}
    margin={{ top: 20, right: 20, bottom: 20, left: 60 }} // ← ✅ 左に余白を追加
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" />
    <YAxis />
    <Tooltip />
    <Legend />
    {selectedPrefectures.map((pref) => (
      <Line
        key={pref.prefName}
        type="monotone"
        dataKey={pref.prefName}
        stroke="#8884d8"
        dot={{ r: 2 }}
      />
    ))}
  </LineChart>
</ResponsiveContainer>

      )}
    </div>
  );
}
