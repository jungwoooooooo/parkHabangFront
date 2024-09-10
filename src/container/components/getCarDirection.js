export async function getCarDirection(startPoint, endPoint) {
    const REST_API_KEY = '5ec7f2e09042f5b2767eac42a19e37f1';
    const url = 'https://apis-navi.kakaomobility.com/v1/directions';

    const origin = `${startPoint.lng},${startPoint.lat}`; 
    const destination = `${endPoint.lng},${endPoint.lat}`;
    
    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json'
    };
  
    const queryParams = new URLSearchParams({
      origin: origin,
      destination: destination
    });
    
    const requestUrl = `${url}?${queryParams}`;

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (!data.routes || data.routes.length === 0) {
        throw new Error('경로 데이터를 찾을 수 없습니다.');
      }

      // 경로 탐색 결과 코드를 확인합니다
      if (data.routes[0].result_code !== 0) {
        throw new Error(`경로 탐색 실패: ${data.routes[0].result_msg}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getCarDirection:', error);
      throw error;
    }
  }