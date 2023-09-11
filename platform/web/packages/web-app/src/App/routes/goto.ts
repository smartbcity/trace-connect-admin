
import {useNavigate, NavigateFunction} from "react-router-dom";
const fileView = (navigate: NavigateFunction) => (filePath: string) => {
    navigate(`${filePath}`)
}

export const useGoto = () => {
    const navigate = useNavigate()
    return {
        fileView: fileView(navigate)
    }
}