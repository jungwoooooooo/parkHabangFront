// 카카오 주차장 경로 찾기
export async function getCarDirection(startPoint, endPoint) {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY; // 환경 변수 사용
    const url = 'https://apis-navi.kakaomobility.com/v1/directions';

    const origin = `${startPoint.lng},${startPoint.lat}`; // 출발지 좌표
    const destination = `${endPoint.lng},${endPoint.lat}`; // 도착지 좌표
    const priority = 'TIME'; // 우선순위

    // 헤더 설정
    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json'
    };
  
    // 쿼리 파라미터 설정
    const queryParams = new URLSearchParams({
      origin, // 출발지 좌표
      destination, // 도착지 좌표
      priority
    });
    
    // 요청 URL 생성
    const requestUrl = `${url}?${queryParams}`;

    // 요청 처리
    try {
      console.log('API 요청 URL:', requestUrl);
      console.log('API 요청 헤더:', headers);

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP 오류! 상태: ${response.status}, 내용: ${errorBody}`);
      }

      const data = await response.json();
      console.log('API 응답 전체:', JSON.stringify(data, null, 2));

      if (!data.routes || data.routes.length === 0) {
        throw new Error('경로 데이터를 찾을 수 없습니다.');
      }

      const route = data.routes[0];
      if (route.result_code !== 0) {
        throw new Error(`경로 탐색 실패: ${route.result_msg}`);
      }

      // 경로 데이터 구조 확인
      if (!route.sections || route.sections.length === 0) {
        throw new Error('유효한 경로 섹션이 없습니다.');
      }

      // 경로 좌표 추출
      const path = route.sections.flatMap(section => 
        section.roads.flatMap(road => 
          road.vertexes.reduce((acc, coord, index, array) => {
            if (index % 2 === 0) {
              acc.push([coord, array[index + 1]]);
            }
            return acc;
          }, [])
        )
      );

      return { route, path };
    } catch (error) {
      console.error('getCarDirection 오류:', error);
      throw new Error(`경로를 가져오는 데 실패했습니다: ${error.message}`);
    }
  }