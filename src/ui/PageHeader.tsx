import { LEVELS } from '../constants/levels';

import SignOutBtn from '../features/Dashboard/SignOutBtn';

type PageHeaderProps = {
    handleSignOut: () => void;
};

function PageHeader({ handleSignOut }: PageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex mx-4">
                <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-teal-700 p-6 text-white">
                    <span className="font-bold text-2xl">H</span>
                </div>
                <div className="flex flex-col mx-4">
                    <h1 className="font-bold text-center text-xl">
                        Progress Tracker
                    </h1>
                    <small>Hoshida International</small>
                </div>
            </div>
            <div className="flex items-center ">
                <div className=" flex mx-4 gap-3">
                    {Object.entries(LEVELS).map(([level, { color, label }]) => (
                        <div key={level} className="flex items-center">
                            <div
                                className={`rounded-md ${color} h-4 w-4 mx-2`}
                            ></div>
                            <p className="text-[10px] whitespace-nowrap">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
                <SignOutBtn onHandleSignout={handleSignOut} />
            </div>
        </div>
    );
}

export default PageHeader;
