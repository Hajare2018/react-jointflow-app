import { useState } from 'react';
import parse from 'html-react-parser';
import Card from '../Card';
import Messages from '../Messages';
import WatcherCard from '../WatcherCard';
import { Badge } from '../../../component-lib/catalyst/badge';
import TaskActions from '../TaskActions';
import TaskBadge from '../TaskBadge';
import ContactCard from '../ContactCard';
import { useUserContext } from '../../../context/UserContext';
import UploadDialog from '../UploadDialog';
import { TransferDialogForm } from '../TransferDialog';

export default function YourTask({ card, watchers, refetchWatcher, project, refetchCard }) {
  const { user, accessToken } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 flex-1 auto-rows-min">
        <Card
          title="Your task"
          className="col-span-2"
        >
          <h2 className="text-xl text-light mb-4">{card.title}</h2>
          <div className="min-h-28 max-h-28 overflow-auto">{parse(card.description)}</div>
        </Card>
        <Card
          title="Owners"
          className=""
        >
          <div>
            <p className="text-xs mb-1">Internal</p>
            <ContactCard
              user={card.internal_assignee_details}
              enableAddContact={!!user.is_staff}
              onAddContactClick={() => setIsOpen(true)}
            />
          </div>
          <div>
            <p className="text-xs mb-1 mt-4">External</p>
            <ContactCard
              user={card.external_assignee_details}
              enableAddContact
              onAddContactClick={() => setIsOpen(true)}
            />
          </div>
        </Card>
        <Card
          title="Watchers"
          className=""
        >
          <div>
            <p className="text-xs mb-1">Internal</p>
            <WatcherCard
              users={watchers.filter((w) => w.is_internal_assignee)}
              enableAddWatcher={!!user.is_staff}
            />
          </div>
          <div>
            <p className="text-xs mb-1 mt-4">External</p>
            <WatcherCard
              users={watchers.filter((w) => !w.is_internal_assignee)}
              refetchWatcher={refetchWatcher}
              task={card}
              buyerCompany={project.buyer_company_details_light}
            />
          </div>
        </Card>
        <div className="flex flex-col">
          <Card
            title="Task timing"
            className="flex-1"
          >
            <div className="flex shadow-sm border rounded p-2 bg-slate-50 items-center justify-between">
              <div>
                <p>End date:</p>
                <p>{card.end_date}</p>
              </div>
              <TaskBadge task={card} />
            </div>
          </Card>
          <TaskActions
            task={card}
            buyerCompany={project.buyer_company_details_light}
            refetchTask={refetchCard}
          />
        </div>
        <Card
          title="Related content"
          className=""
          titleAction={
            <UploadDialog
              boardId={card.board_id}
              taskId={card.id}
              onUploadSuccess={refetchCard}
            />
          }
        >
          {card.attachments.length === 0 ? (
            <div className="h-48">No related documents</div>
          ) : (
            <ol className="flex flex-col gap-4 overflow-auto h-48 max-h-48">
              {card.attachments.map((a) => (
                <li key={a.id}>
                  <a
                    className="flex justify-between items-center"
                    href={`${a.document_url}/${accessToken}`}
                  >
                    <span className="underline">{a.name}</span>
                    <Badge color="violet">{a.extension}</Badge>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
      <Messages
        messages={card.external_comments || card.comments.filter((c) => c.client_facing)}
        currentUser={user}
        cardId={card.id}
        ownerId={card.owner_details.id}
        refetchCard={refetchCard}
      />
      <TransferDialogForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        type="assign"
        task={card}
        buyerCompany={project.buyer_company_details_light}
        refetchTask={refetchCard}
      />
    </>
  );
}
