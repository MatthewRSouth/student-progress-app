type StudentPropTypes = {
    name: string;
};
function Student({ name }: StudentPropTypes) {
    return (
        <div>
            <span className="rounded-full bg-blue-300 text-blue-700">
                {name[1]}
                {name[2]}
            </span>
        </div>
    );
}

export default Student;
