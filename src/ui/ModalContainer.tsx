type MoadlContainerProps = {
    children: React.ReactNode;
    onClose: () => void;
};

function ModalContainer({ children, onClose }: MoadlContainerProps) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 h-screen"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-[90vw] w-100 p-6 rounded-xl"
            >
                {children}
            </div>
        </div>
    );
}

export default ModalContainer;
