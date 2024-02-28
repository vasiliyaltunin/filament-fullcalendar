<?php

namespace Saade\FilamentFullCalendar\Actions;

use Filament\Actions\ViewAction as BaseViewAction;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CellAction extends BaseViewAction
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Cell');
        $this->name('cell');

        $this->modalHeading(
            fn (FullCalendarWidget $livewire) => $livewire->getCellFromHeader()
        );

        $this->model(
            fn (FullCalendarWidget $livewire) => $livewire->getModel()
        );

        $this->record(
            fn (FullCalendarWidget $livewire) => $livewire->getRecord()
        );
       
        $this->form(
            fn (FullCalendarWidget $livewire) => $livewire->getCellEditFormSchema()
        );

        $this->after(
            fn (FullCalendarWidget $livewire) => $livewire->refreshRecords()
        );

        $this->cancelParentActions();


    }
}
