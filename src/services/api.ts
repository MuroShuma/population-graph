import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ .envファイルにAPIキー(REACT_APP_API_KEY)が設定されていません');
}

console.log('使用中のAPIキー:', API_KEY); // デバッグ用

const apiClient = axios.create({
  baseURL: 'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1',
  headers: {
    'X-API-KEY': API_KEY ?? '',
  },
});

/**
 * 都道府県一覧の取得
 */
export const fetchPrefectures = async () => {
  try {
    const res = await apiClient.get('/prefectures');
    return res.data.result;
  } catch (error) {
    console.error('❌ fetchPrefectures エラー:', error);
    throw error;
  }
};

/**
 * 人口構成データの取得
 * @param prefCode 都道府県コード
 */
export const fetchPopulation = async (prefCode: number) => {
  try {
    const res = await apiClient.get('/population/composition/perYear', {
      params: { prefCode },
    });
    return res.data.result;
  } catch (error) {
    console.error('❌ fetchPopulation エラー:', error);
    throw error;
  }
};
