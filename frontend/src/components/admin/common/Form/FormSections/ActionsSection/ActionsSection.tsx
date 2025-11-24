'use client';

import classes from './ActionsSection.module.scss';
import { Save, X, Loader, Trash } from 'lucide-react';
import { GETTABLE_NAMES, isCruddableName } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';

interface ActionsSectionProps<M extends GETTABLE_NAMES> {
  is_loading: boolean;
  is_valid: boolean;
  handleClose: () => void;
  model?: M;
  action?: 'create' | 'update' | 'restore';
  id?: string;
}

export function ActionsSection<M extends GETTABLE_NAMES>({
  is_loading,
  is_valid,
  handleClose,
  model,
  action = 'create',
  id
}: ActionsSectionProps<M>) {
  const delete_mutation = (model && isCruddableName(model) && id) ? useModel(model).remove(id) : null;

  return (
    <div className={classes.actions}>
      <div className={classes.actions_left}>
        {(id && delete_mutation) && <button
          type="button"
          className={`${classes.actions_button} ${classes.actions_button_secondary}`}
          onClick={() => delete_mutation?.mutate()}
          disabled={is_loading}
        >
          <Trash size={16} />
          Delete
        </button>}
      </div>
      <div className={classes.actions_right}>
        <button
          type="button"
          className={`${classes.actions_button} ${classes.actions_button_secondary}`}
          onClick={handleClose}
          disabled={is_loading}
        >
          <X size={16} />
          Cancel
        </button>
        <button
          type="submit"
          className={`${classes.actions_button} ${classes.actions_button_primary}`}
          disabled={is_loading || !is_valid}
        >
          {is_loading ? (
            <>
              <Loader className={classes.actions_spinner} size={16} />
              <span>{
                action === 'create' ? 'Creating' : action === 'update' ? 'Updating' : 'Restoring'
              }</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>{
                action === 'create' ? 'Create' : action === 'update' ? 'Update' : 'Restore'
              }</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 