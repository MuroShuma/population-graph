import { useEffect, useState } from 'react';
import PrefectureSelector from './components/PrefectureSelector';
import PopulationGraph from './components/PopulationGraph';
import { fetchPrefectures } from './services/api';
import './App.css';

type Prefecture = {
  prefCode: number;
  prefName: string;
};

const POPULATION_LABELS = ['総人口', '年少人口', '生産年齢人口', '老年人口'] as const;
type PopulationLabel = typeof POPULATION_LABELS[number];

function App() {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);
  const [populationType, setPopulationType] = useState<PopulationLabel>('総人口');
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        setPrefectures(data);
      } catch (error) {
        console.error('都道府県の取得に失敗しました:', error);
      }
    };
    loadPrefectures();
  }, []);

  // 選択中の都道府県のオブジェクト配列を抽出
  const selectedPrefectures = prefectures.filter((p) =>
    selectedPrefCodes.includes(p.prefCode)
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>都道府県別人口推移グラフ</h1>
      </header>

      <main>
        <PrefectureSelector selected={selectedPrefCodes} onChange={setSelectedPrefCodes} />

        <div className="population-type-buttons">
          {POPULATION_LABELS.map((label) => (
            <button
              key={label}
              onClick={() => setPopulationType(label)}
              disabled={label === populationType}
            >
              {label}
            </button>
          ))}
        </div>

        <PopulationGraph
          selectedPrefectures={selectedPrefectures}
          populationLabel={populationType}
        />
      </main>
    </div>
  );
}

export default App;
