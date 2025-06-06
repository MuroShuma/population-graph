// src/components/PrefectureSelector.tsx
import { useEffect, useState } from 'react';
import { fetchPrefectures } from '../services/api';

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type Props = {
  selected: number[];
  onChange: (newSelected: number[]) => void;
};

export default function PrefectureSelector({ selected, onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        console.log('都道府県一覧取得成功:', data);
        setPrefectures(data);
      } catch (error) {
        console.error('都道府県の取得に失敗しました:', error);
      }
    };
    loadPrefectures();
  }, []);

  const handleToggle = (prefCode: number) => {
    const newSelected = selected.includes(prefCode)
      ? selected.filter((code) => code !== prefCode)
      : [...selected, prefCode];
    onChange(newSelected);
  };

  return (
    <div className="prefecture-selector">
      <h2>都道府県一覧</h2>
      <div className="checkbox-list">
        {prefectures.map((pref) => (
          <label key={pref.prefCode}>
            <input
              type="checkbox"
              value={pref.prefCode}
              checked={selected.includes(pref.prefCode)}
              onChange={() => handleToggle(pref.prefCode)}
            />
            {pref.prefName}
          </label>
        ))}
      </div>
    </div>
  );
}
