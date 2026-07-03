//types
type SuccessMessageProps = {
    message: string;
};

function SuccessMessage({ message }: SuccessMessageProps) {
    return <p>{message}</p>;
}

export default SuccessMessage;
