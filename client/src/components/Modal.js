import { modalClose } from './../utils/functions';
import { SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import modals from '../constants/modals';   
import Modal from "react-native-modal";

export default function ModalComp({ name, data }) {

    const currentModal = modals.find(modal => modal.name === name);

    let [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        modalClose();
        return null;
    }
    
    return (
        <SafeAreaView>
            <Modal
                isVisible={isOpen}
                onBackdropPress={closeModal}
                onBackButtonPress={closeModal}
                onSwipeComplete={closeModal}
                swipeDirection={['up', 'down', 'left', 'right']}
                style={{ flex: 1, maxHeight: 400, minHeight: 200, marginTop: '30%' }}
            >
                <currentModal.element data={data} close={closeModal} />
            </Modal>
        </SafeAreaView>
    )
}