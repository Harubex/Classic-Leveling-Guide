interface QuestIconProps {
    type: "turnin" | "accept"
}

export const QuestIcon: React.FC<QuestIconProps> = (props) => {
    const src = `https://minecraft-map69.s3.us-east-2.amazonaws.com/quest_${props.type}.png`;
    return (
        <div className="quest-icon">
            <img src={src} />
        </div>
    );
};

export default QuestIcon;