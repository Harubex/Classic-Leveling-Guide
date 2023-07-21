interface StepProps {
    number: number;
}

export const Step: React.FC<StepProps> = ({ number }) => {
    return (
        <div key={`${number}-step`} className="step-number">
            {`${number}) `}
        </div>
    );
}

export default Step;