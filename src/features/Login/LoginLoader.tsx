type Props = {
    children: string;
};

function LoginLoader({ children }: Props) {
    return (
        <div className="text-center">
            <p>{children}</p>
        </div>
    );
}

export default LoginLoader;
