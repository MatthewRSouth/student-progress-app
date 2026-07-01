export default function ErrorMessage({ message }: { message: string }) {
    return <span className="text-red-500">{message}</span>;
}
