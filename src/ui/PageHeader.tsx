import { LEVELS } from '../constants/levels';

import SignOutBtn from '../features/Dashboard/SignOutBtn';

type PageHeaderProps = {
    handleSignOut: () => void;
};

function PageHeader({ handleSignOut }: PageHeaderProps) {
    return (
        <div className="flex justify-between">
            <div>header</div>
            <div className="flex items-center">
                <div className="mx-4">
                    <h2>header</h2>
                </div>
                <SignOutBtn onHandleSignout={handleSignOut} />
            </div>
        </div>
    );
}

export default PageHeader;
