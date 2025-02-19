import { useMutation, useSuspenseQueries } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';
import Roadmap from './Roadmap/Roadmap';
import AvatarGroup from './AvatarGroup';
import React, { useEffect, useState } from 'react';
import MaapNavigation from './Navbar';
import ContactCard from './ContactCard';
import {
  singleCardQuery,
  projectQuery,
  contentsQuery,
  vendorQuery,
  watchersQuery,
} from './queries';
import YourTask from './Tabs/YourTask';
import ProjectView from './Tabs/Project';
import ContentTab from './Tabs/ContentTab';
import Unauthorized from './Unauthorized';
import HttpClient from '../../Api/HttpClient';
import { useUserContext } from '../../context/UserContext';

export default function MutualActionPlan() {
  const { cardId, projectId } = useLoaderData();
  const [tabIndex, setTabIndex] = useState(0);
  const { user: parsedData } = useUserContext();
  const isUserInternal = parsedData?.is_staff;

  const {
    data: { card, project, contentList, vendor, watchers },
    refetch: { card: refetchCard, watcher: refetchWatcher },
  } = useSuspenseQueries({
    queries: [
      singleCardQuery(cardId),
      projectQuery(projectId),
      contentsQuery(projectId),
      vendorQuery(),
      watchersQuery(cardId),
    ],
    combine: (results) => {
      return {
        data: {
          card: results[0].data,
          project: results[1].data,
          contentList: results[2].data,
          vendor: results[3].data,
          watchers: results[4].data,
        },
        pending: results.some((result) => result.isPending),
        refetch: {
          card: results[0].refetch,
          watcher: results[4].refetch,
        },
      };
    },
  });

  const onLoadTrackMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('board', projectId);
      formData.append('project_title', project.name);
      formData.append('event_type', 'Project');
      const result = await HttpClient.postTrackingData({ data: formData });

      return result;
    },
  });

  useEffect(() => {
    if (!isUserInternal) {
      onLoadTrackMutation.mutate();
    }
  }, []);

  const trackTabClicks = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('board', projectId);
      formData.append('project_title', project.name);
      formData.append('event_type', 'Tab');
      const result = await HttpClient.postTrackingData({ data: formData });

      return result;
    },
  });

  const handleTabSelection = (index) => {
    setTabIndex(index);
    if (!isUserInternal) {
      trackTabClicks.mutate();
    }
  };

  if (card === null) {
    return <Unauthorized />;
  }

  return (
    <div className="h-screen">
      <div className="min-h-svh max-h-svh flex">
        <div
          className="bg-slate-50 relative"
          style={{ width: 'calc(336px + (100vw - 1280px) / 2)' }}
        >
          <div className="h-full w-80 absolute right-6 pt-6 flex flex-col">
            <div>
              <div className="mb-8">
                <AvatarGroup
                  size={16}
                  users={[
                    {
                      id: 1,
                      avatar: project.buyer_company_details_light.company_image,
                      first_name: 'J',
                      last_name: 'F',
                    },
                    {
                      id: 2,
                      avatar: vendor.company_logo,
                      first_name: vendor.company_name,
                      last_name: 'FC',
                    },
                  ]}
                />
                <h1 className="font-bold text-slate-900 text-3xl my-8 line-clamp-3 min-h-[108px]">
                  {project.name}
                </h1>
              </div>
            </div>
            <Roadmap
              tasks={project.maap_cards}
              project={project}
            />
            <div>
              <div className="mt-8 mb-4">
                <ContactCard user={card.owner_details} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col"
          style={{ width: 944 }}
        >
          <div className="px-6 py-1">
            <MaapNavigation
              tabs={contentList.tab_names}
              selectedTabIndex={tabIndex}
              onTabSelect={(index) => handleTabSelection(index)}
            />
          </div>
          <div className="flex gap-x-6 p-6 mt-[0.875rem] flex-1 max-h-[calc(100vh-120px)] overflow-y-auto">
            {tabIndex === 0 && (
              <YourTask
                card={card}
                watchers={watchers}
                project={project}
                refetchCard={refetchCard}
                refetchWatcher={refetchWatcher}
              />
            )}
            {tabIndex === 1 && <ProjectView project={project} />}
            {tabIndex >= 2 && (
              <ContentTab
                contents={contentList.cblocks.filter((cblock) => {
                  return cblock.tab_name === contentList.tab_names[tabIndex - 2].tab_name;
                })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
