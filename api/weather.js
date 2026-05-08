export default async function handler(req, res) {
  // 1. Vercel 환경변수에서 Decoding 키를 가져옵니다.
  const serviceKey = process.env.weather_key;

  // 2. 현재 날짜와 시간 계산 (부산 등 국내 기준 KST 적용)
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const baseDate = kst.toISOString().slice(0, 10).replace(/-/g, "");
  const baseTime = "0500"; // 가장 안정적인 새벽 5시 발표 데이터

  // 3. API URL 구성 (인증키는 이미 디코딩된 상태이므로 주소에 그대로 합침)
  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
  const queryParams = `?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=98&ny=76`;

  try {
    const response = await fetch(url + queryParams);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "인증키 적용 또는 API 호출 중 오류가 발생했습니다." });
  }
}
