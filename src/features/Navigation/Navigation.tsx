import AddCriteriaBtn from '../../ui/AddCriteriaBtn';
import PageHeader from '../../ui/PageHeader';
import Tabs from '../Dashboard/Tabs';
import AddStudent from '../../ui/AddStudent';
import { type Cls } from '../../types';

type NavigationProps = {
    handleSignOut: () => void;
    selectedClassId: number;
    classes: Cls[];
    onSelectClass: (id: number) => void;
    setAddCriteriaModal: (bool: boolean) => void;
    setAddStudentModal: (bool: boolean) => void;
};

function Navigation({
    handleSignOut,
    selectedClassId,
    classes,
    onSelectClass,
    setAddCriteriaModal,
    setAddStudentModal,
}: NavigationProps) {
    return (
        <>
            <PageHeader handleSignOut={handleSignOut} />

            {/* Navigation */}
            <Tabs
                selectedClassId={selectedClassId}
                classes={classes}
                onSelectClass={onSelectClass}
            ></Tabs>
            <div className="flex justify-end mr-10">
                <AddCriteriaBtn
                    setAddCriteriaModal={setAddCriteriaModal}
                ></AddCriteriaBtn>
                <AddStudent
                    setAddStudentModal={setAddStudentModal}
                ></AddStudent>
            </div>
        </>
    );
}

export default Navigation;
