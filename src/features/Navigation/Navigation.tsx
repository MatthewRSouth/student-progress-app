import EditCriteriaBtn from '../../ui/EditCriteriaBtn';
import PageHeader from '../../ui/PageHeader';
import Tabs from '../Dashboard/Tabs';
import AddStudent from '../../ui/AddStudent';
import { type Cls, type CriteriaLanguage } from '../../types';

type NavigationProps = {
    handleSignOut: () => void;
    criteriaLanguage: CriteriaLanguage;
    onChangeCriteriaLanguage: (criteriaLanguage: CriteriaLanguage) => void;
    selectedClassId: number;
    classes: Cls[];
    onSelectClass: (id: number) => void;
    isArchivedViewSelected: boolean;
    onSelectArchivedView: () => void;
    setEditCriteriaModal: (bool: boolean) => void;
    setAddStudentModal: (bool: boolean) => void;
};

function Navigation({
    handleSignOut,
    criteriaLanguage,
    onChangeCriteriaLanguage,
    selectedClassId,
    classes,
    onSelectClass,
    isArchivedViewSelected,
    onSelectArchivedView,
    setEditCriteriaModal,
    setAddStudentModal,
}: NavigationProps) {
    return (
        <>
            <PageHeader
                handleSignOut={handleSignOut}
                criteriaLanguage={criteriaLanguage}
                onChangeCriteriaLanguage={onChangeCriteriaLanguage}
            />

            {/* Navigation */}
            <Tabs
                selectedClassId={selectedClassId}
                classes={classes}
                onSelectClass={onSelectClass}
                isArchivedViewSelected={isArchivedViewSelected}
                onSelectArchivedView={onSelectArchivedView}
            ></Tabs>
            {/* These act on the selected class, so they don't apply to the archived view */}
            {!isArchivedViewSelected && (
                <div className="flex justify-end mr-10">
                    <EditCriteriaBtn
                        setEditCriteriaModal={setEditCriteriaModal}
                    ></EditCriteriaBtn>
                    <AddStudent
                        setAddStudentModal={setAddStudentModal}
                    ></AddStudent>
                </div>
            )}
        </>
    );
}

export default Navigation;
