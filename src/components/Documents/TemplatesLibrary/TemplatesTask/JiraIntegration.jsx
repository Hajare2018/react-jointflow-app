import { SwitchField, Switch } from '../../../../component-lib/catalyst/switch';
import { Label, Description } from '../../../../component-lib/catalyst/fieldset';

export default function JiraIntegration({ onChange, enabled }) {
  return (
    <div className="flex justify-start items-center p-6">
      <div className="">
        <SwitchField>
          <Label>Allow syncing to Jira</Label>
          <Description>Create a new project on Jira and sync tasks</Description>
          <Switch
            name="allow_jira_sync"
            checked={!!enabled}
            onChange={onChange}
          />
        </SwitchField>
      </div>
    </div>
  );
}
