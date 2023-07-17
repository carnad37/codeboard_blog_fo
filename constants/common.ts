// enum보다는 해당 방식이 Tree-shaking(빌드시 쓸데없는 모듈까지 Import되는 문제 해결) 측면에서 유리.
export const COMMON = {
    API: {
        SUCCESS : {
            CODE : "00000"
        },
        ERROR : {
            NETWORK_FAIL : '서버와 통신에 실패했습니다'
        },
    },
    CONFIG : {
        EMIT: {
            LAYOUT: {
                NO_MENU_LAYOUT: ['open:alert']
            }
        }
    }
} as const;