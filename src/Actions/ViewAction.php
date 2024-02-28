<?php

namespace Saade\FilamentFullCalendar\Actions;

use Filament\Actions\ViewAction as BaseViewAction;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class ViewAction extends BaseViewAction
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->model(
            fn (FullCalendarWidget $livewire) => $livewire->getModel()
        );

        $this->record(
            fn (FullCalendarWidget $livewire) => $livewire->getRecord()
        );

        $this->form(
            fn (FullCalendarWidget $livewire) => $livewire->getFormSchema()
        );

        $actions = function(ViewAction $action, FullCalendarWidget $livewire) {
            $result = [];
            
            foreach ($livewire->getCachedModalActions() as $a) {
                if ($a->name != 'cell') {
                    $result[] = $a;
                }
            }
            $result[] = $action->getModalCancelAction();

            return $result;
        };

        $this->modalFooterActions($actions);

        $this->after(
            fn (FullCalendarWidget $livewire) => $livewire->refreshRecords()
        );

        $this->cancelParentActions();
    }
}
