import { Button } from "@mui/material";

interface HeaderContentProps {
  title: string,
  handleAction: (params: any) => any
}

export function HeaderContent({ handleAction, title }: HeaderContentProps) {
  return (
    <div className="header-content">
      <h1> {title} </h1>
      <Button
        className='button-create'
        variant="contained"
        onClick={handleAction}
      >
        +
      </Button>
    </div>
  )
}