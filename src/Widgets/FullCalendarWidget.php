<?php

namespace Saade\FilamentFullCalendar\Widgets;

use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Widgets\Widget;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentFullCalendar\Actions;

class FullCalendarWidget extends Widget implements HasForms, HasActions
{
    use InteractsWithForms;
    use InteractsWithActions;
    use Concerns\InteractsWithEvents;
    use Concerns\InteractsWithRecords;
    use Concerns\InteractsWithHeaderActions;
    use Concerns\InteractsWithModalActions;

    protected static string $view = 'filament-fullcalendar::fullcalendar';

    protected int | string | array $columnSpan = 'full';

    public Model | string | null $cellsModel = null;

    public string $cellFormHeader = '';

    public function getCellFromHeader(): string {
        return $this->cellFormHeader;
    }

    protected function headerActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function modalActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
            Actions\CellAction::make(),
        ];
    }

    protected function viewAction(): Action
    {
        return Actions\ViewAction::make();
    }

    /**
     * FullCalendar will call this function whenever it needs new event data.
     * This is triggered when the user clicks prev/next or switches views.
     * @param array{start: string, end: string, timezone: string} $info
     */
    public function fetchEvents(array $info): array
    {
        return [];
    }

    public function getFormSchema(): array
    {
        return [];
    }

    public function getCellEditFormSchema(): array
    {
        return [];
    }

    public function fetchCellsData(array $info): array {
        return [];
    }

    public function getCellTemplate(): string {
        return "";
    }



}
