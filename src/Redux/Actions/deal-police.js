import { createAction } from 'redux-actions';
import * as DealPolice from '../../Api/deal-police';
import { handleError } from '../../components/Utils';
import { UPDATE_DEAL_POLICE } from '../Constants/actionTypes';
import { updatedPoliceData } from '../Reducers/deal-police';
import { show } from './loader';
import getSingleTask from './single-task';
import { showSuccessSnackbar } from './snackbar';

const edit_deal_police = createAction(UPDATE_DEAL_POLICE);

export function editDealPolice(params) {
  return (dispatch) =>
    DealPolice.putDealPolice(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(
          getSingleTask({
            card_id: params?.card_id,
            board_id: params?.board,
            task_info: true,
          }),
        );
        dispatch(edit_deal_police(data));
        dispatch(updatedPoliceData({ data: data.data, errors: null }, UPDATE_DEAL_POLICE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
