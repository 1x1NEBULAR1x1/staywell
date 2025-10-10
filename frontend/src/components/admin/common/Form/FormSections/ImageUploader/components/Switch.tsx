import { Camera, Link } from 'lucide-react';
import classes from '../ImageUploader.module.scss';

interface SwitchProps {
  image_type: 'file' | 'url';
  handleTypeChange: (type: 'file' | 'url') => void;
  is_loading: boolean;
}

export const Switch = ({ image_type, handleTypeChange, is_loading }: SwitchProps) => {

  return (
    <div className={classes.image_uploader_type_switcher}>
      <button
        type="button"
        className={`${classes.image_uploader_type_button} ${image_type === 'file' ? classes.image_uploader_type_button_active : ''}`}
        onClick={() => handleTypeChange('file')}
        disabled={is_loading}
      >
        <Camera size={16} />
        {'File type'}
      </button>
      <button
        type="button"
        className={`${classes.image_uploader_type_button} ${image_type === 'url' ? classes.image_uploader_type_button_active : ''}`}
        onClick={() => handleTypeChange('url')}
        disabled={is_loading}
      >
        <Link size={16} />
        {'URL type'}
      </button>
    </div>
  );
};