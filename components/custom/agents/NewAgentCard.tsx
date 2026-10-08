import React from 'react'
import { CreatedAgentType } from './CreateAgent'
import { Calendar, CalendarCheck2Icon, Ellipsis, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'


type Props={
  createdAgent: CreatedAgentType | null
}

const NewAgentCard = ({createdAgent}:Props) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-4 items-center'>
      <img src={createdAgent?.agentImage} alt={createdAgent?.name} width={60} height={60}
      className='p-2 bg-slate-100 rounded-xl' />
      <div className='flex flex-col gsp-1'>
        <h2 className='font-semibold flex gap-2 items-center'>{createdAgent?.name}
          <span className='text-green-700 bg-green-100 text-sm rounded-2xl px-2'>{createdAgent?.status}</span>
        </h2>
        <p className='text-muted-foreground text-md line-clamp-1'>{createdAgent?.description}</p>
        <div className='flex gap-3 items-center text-muted-foreground text-sm items-center mt-2'>
        <div className='flex gap-2 '>
          <CalendarCheck2Icon/> Next Run on { createdAgent?.schedule?.time }
        </div>
        <h2>Runs {createdAgent?.schedule?.frequency}</h2>
        </div>
      </div>
      </div>

      <div className='flex gap-2 items-center text-muted-foreground' >
        <Button variant={'ghost'} size={'icon'}>
        <Pencil />
        </Button>
        <Button variant={'ghost'} size={'icon'}>
        <Ellipsis />
        </Button>
      </div>
    </div>
  )
}

export default NewAgentCard;
