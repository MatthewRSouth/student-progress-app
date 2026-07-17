type SignOutBtnProps = {
    onHandleSignout: () => void;
};

function SignOutBtn({ onHandleSignout }: SignOutBtnProps) {
    return (
        <div className="flex w-full justify-end ">
            <button
                className="mr-5 my-5 p-3 bg-black text-white text-center rounded-lg cursor-pointer hover:bg-gray-500"
                onClick={onHandleSignout}
            >
                logout
            </button>
        </div>
    );
}

export default SignOutBtn;
