import { ButtonColors } from '../../../enums/button.enum';
import { Button } from '../button/button';

export function BackupOption(props: {
  icon: string;
  text: string;
  type?: 1 | 2;
  imageSize?: { width?: number; height?: number };
  loading?: boolean;
  onClick?: () => void;
}) {
  const { icon, text, type = 1, imageSize, loading, onClick } = props;

  return (
    <Button
      text={text}
      className={type === 1 ? 'full-width-button' : undefined}
      color={type === 1 ? ButtonColors.SECONDARY : ButtonColors.BACKUP}
      loading={loading}
      disabled={onClick === undefined}
      onClick={onClick}
      muiProps={{
        startIcon: (
          <>
            <img
              width={imageSize?.width || 20}
              height={imageSize?.height || 20}
              src={icon}
              alt={''}
            />
          </>
        ),
      }}
    />
  );
}
