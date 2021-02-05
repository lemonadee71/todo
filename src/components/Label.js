import Component from '../helpers/component';
import Icons from './Icons';

const Label = ({
  label,
  taskLabels,
  onClick,
  updateLabel,
  allowEdit,
  disableEdit,
  removeLabel,
}) => {
  let isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  return Component.parseString`
    <div class="label${isSelected ? ' selected' : ''}" 
    data-label-name="${label.name}" 
    data-color="${label.color}" 
    ${{ onClick }}>
      <input
        type="text"
        name="label-name"
        value="${label.name}"
        required
        disabled
        ${{ onChange: updateLabel, onFocusout: disableEdit }}
      />
      <div class="actions"> 
        <button ${{ onClick: allowEdit }}>${Icons('edit')}</button>
        <button ${{
          onClick: (e) => {
            removeLabel(label.name);
            e.stopPropagation();
          },
        }}>
          ${Icons('delete')}
        </button>
      </div>
    </div>
  `;
};

export default Label;
