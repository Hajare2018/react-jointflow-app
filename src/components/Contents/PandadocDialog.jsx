import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { Button } from '../../component-lib/catalyst/button';
import { useEffect, useState } from 'react';
import { Fieldset, Legend, Field, FieldGroup, Label } from '../../component-lib/catalyst/fieldset';
import { Select } from '../../component-lib/catalyst/select';
import { Input } from '../../component-lib/catalyst/input';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';

export default function PandadocDialog({ open, onClose, onDocumentSent, pandadocApiKey }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [stage, setStage] = useState(0);
  const [sender, setSender] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [client, setClient] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [documentName, setDocumentName] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await fetch('https://api.pandadoc.com/public/v1/templates', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${pandadocApiKey}`,
        },
      });
      const data = await response.json();
      setTemplates(data.results);
    };
    loadTemplates();
  }, []);

  useEffect(() => {
    const loadTemplateDetails = async (templateId) => {
      const response = await fetch(
        `https://api.pandadoc.com/public/v1/templates/${templateId}/details`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Api-Key ${pandadocApiKey}`,
          },
        },
      );
      const data = await response.json();
      setTemplateDetails(data);
      setTemplateData(
        Object.fromEntries(
          new Map(
            data.tokens.map((token) => {
              return [token.name, ''];
            }),
          ),
        ),
      );
      setDocumentName(data.name);
    };

    if (selectedTemplateId !== null) {
      loadTemplateDetails(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  const closeDialog = () => {
    setSelectedTemplateId(null);
    setTemplateData(null);
    setTemplateDetails(null);
    setStage(0);
    setDocumentName('');
    setDocumentId(null);
    setDocumentStatus(null);
    clearInterval(intervalId);
    setIntervalId(null);
    setSender({
      email: '',
      firstName: '',
      lastName: '',
    });
    setClient({
      email: '',
      firstName: '',
      lastName: '',
    });
    onClose();
  };

  const handeSenderChange = (e) =>
    setSender((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const handeClientChange = (e) =>
    setClient((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleNextButtonClick = async () => {
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setStage(2);

      const data = await fetch('https://api.pandadoc.com/public/v1/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${pandadocApiKey}`,
        },
        body: JSON.stringify({
          name: documentName,
          template_uuid: selectedTemplateId,
          recipients: [
            {
              email: sender.email,
              first_name: sender.firstName,
              last_name: sender.lastName,
              role: 'Sender',
            },
            {
              email: client.email,
              first_name: client.firstName,
              last_name: client.lastName,
              role: 'Client',
            },
          ],
          tokens: Object.entries(templateData).map(([name, value]) => ({
            name,
            value,
          })),
        }),
      });
      const documentData = await data.json();
      setDocumentId(documentData.id);
      setDocumentStatus(documentData.status);
    }
  };

  useEffect(() => {
    const fn = async () => {
      if (documentId) {
        if (documentStatus === 'document.draft') {
          clearInterval(intervalId);
          const data = await fetch(
            `https://api.pandadoc.com/public/v1/documents/${documentId}/send`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${pandadocApiKey}`,
              },
              body: JSON.stringify({}),
            },
          );
          const documentData = await data.json();
          setDocumentStatus(documentData.status);
          setIntervalId(null);
        } else if (documentStatus === 'document.uploaded' && intervalId === null) {
          const i = setInterval(async () => {
            const data = await fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${pandadocApiKey}`,
              },
            });
            const documentData = await data.json();
            setDocumentStatus(documentData.status);
          }, 10000);
          setIntervalId(i);
        } else if (documentStatus === 'document.sent') {
          const [clientRespont, senderResponse] = await Promise.all([
            fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/session`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${pandadocApiKey}`,
              },
              body: JSON.stringify({
                lifetime: 14 * 24 * 60 * 60,
                recipient: client.email,
              }),
            }),
            fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/session`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${pandadocApiKey}`,
              },
              body: JSON.stringify({
                lifetime: 14 * 24 * 60 * 60,
                recipient: sender.email,
              }),
            }),
          ]);
          const [{ id: clientSessionId }, { id: senderSessionId }] = await Promise.all([
            clientRespont.json(),
            senderResponse.json(),
          ]);
          onDocumentSent({ clientSessionId, senderSessionId, documentId });
          closeDialog();
        }
      }
    };

    fn();

    return () => clearInterval(intervalId);
  }, [documentId, documentStatus, intervalId]);

  const isNextButtonDisabled = () => {
    if (stage === 0) {
      return !templateData || Object.values(templateData).some((value) => value === '');
    }

    if (stage === 1) {
      return (
        !documentName ||
        !sender.email ||
        !sender.firstName ||
        !sender.lastName ||
        !client.email ||
        !client.firstName ||
        !client.lastName
      );
    }

    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
    >
      <div className="flex flew-row justify-between items-center">
        <DialogTitle>Create and send new Pandadoc document</DialogTitle>
        <Button
          plain
          onClick={closeDialog}
        >
          <XMarkIcon className="h-6 w-6" />
        </Button>
      </div>

      <DialogBody>
        {stage === 0 && (
          <>
            <Fieldset className="mb-8">
              <Legend className="mb-4">Document settings</Legend>
              <Field>
                <Label>Select template</Label>
                <Select
                  name="status"
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSelectedTemplateId(null);
                      setTemplateData(null);
                      setTemplateDetails(null);
                    } else {
                      setSelectedTemplateId(e.target.value);
                    }
                  }}
                >
                  <option value="">Select template</option>
                  {templates.map((template) => (
                    <option
                      key={template.id}
                      value={template.id}
                    >
                      {template.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </Fieldset>
            {templateDetails && (
              <Fieldset>
                <Legend className="mb-4">Document details</Legend>
                <FieldGroup className="max-h-[400px] overflow-auto">
                  {templateDetails.tokens.map((token) => (
                    <Field key={token.name}>
                      <Label>{token.name.replaceAll('.', ' ')}</Label>
                      <Input
                        name={token.name}
                        value={templateData[token.name]}
                        onChange={(e) =>
                          setTemplateData((prev) => ({
                            ...prev,
                            [token.name]: e.target.value,
                          }))
                        }
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </Fieldset>
            )}
          </>
        )}
        {stage === 1 && (
          <>
            <Fieldset className="mb-8">
              <Legend className="mb-4">Document name</Legend>
              <FieldGroup>
                <Field>
                  <Input
                    name="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </Fieldset>
            <Fieldset className="mb-8">
              <Legend className="mb-4">Sender recipient</Legend>
              <FieldGroup>
                <Field>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={sender.email}
                    onChange={handeSenderChange}
                  />
                </Field>
                <Field>
                  <Label>First name</Label>
                  <Input
                    name="firstName"
                    value={sender.firstName}
                    onChange={handeSenderChange}
                  />
                </Field>
                <Field>
                  <Label>Last name</Label>
                  <Input
                    name="lastName"
                    value={sender.lastName}
                    onChange={handeSenderChange}
                  />
                </Field>
              </FieldGroup>
            </Fieldset>
            <Fieldset className="mb-8">
              <Legend className="mb-4">Client recipient</Legend>
              <FieldGroup>
                <Field>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={client.email}
                    onChange={handeClientChange}
                  />
                </Field>
                <Field>
                  <Label>First name</Label>
                  <Input
                    name="firstName"
                    value={client.firstName}
                    onChange={handeClientChange}
                  />
                </Field>
                <Field>
                  <Label>Last name</Label>
                  <Input
                    name="lastName"
                    value={client.lastName}
                    onChange={handeClientChange}
                  />
                </Field>
              </FieldGroup>
            </Fieldset>
          </>
        )}
        {stage === 2 && (
          <div className="text-center">
            <Loader />
            <p className="mt-4">
              {!documentStatus ||
                (documentStatus === 'document.uploaded' && 'Preparing document...')}
              {documentStatus === 'document.draft' && 'Sending document...'}
              {documentStatus === 'document.sent' &&
                'Document sent, waiting for recipients to sign...'}
            </p>
          </div>
        )}
      </DialogBody>
      <DialogActions>
        <Button
          disabled={stage === 0 || stage === 2}
          onClick={() => setStage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={isNextButtonDisabled()}
          onClick={handleNextButtonClick}
        >
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
}
