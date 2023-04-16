import ModalComp from "../components/Modal";
import { useSelector } from "react-redux";

export default function ModalOpen() {

    const { open, data } = useSelector(state => state.modal);

    if (open) {
        return (
            <ModalComp name={open} data={data} />
        )
    }

    return null;
}