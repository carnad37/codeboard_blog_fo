export const usePaser = ()=> {
    const strToNum = (parameter : string, error? : Error) => {
        let seq = 0
        if (parameter) {
            try {
                seq = parseInt(parameter)
            } catch (e) {
                // 잘못된 파라미터 입력
                // FIXME :: 에러 발생 필요
                if (error) {
                    throw error
                } else {
                    throw 'error'
                }

            }
        }
        return seq
    }
    return {
        strToNum
    }
}