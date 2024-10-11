import { Component, Input } from '@angular/core';
import { LegInfo } from '../card-detail/card-detail.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-detail-leg',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-detail-leg.component.html',
  styleUrl: './card-detail-leg.component.css',
})
export class CardDetailLegComponent {
  @Input() legInfo: LegInfo | undefined;
  @Input() isLoading: boolean = false;
  @Input() headerText: 'Depart' | 'Return' = 'Depart';
  constructor() {}

  ngOnInit() {}

  toggleDetail(index: number) {
    this.legInfo!.isDetailSegmentAmenities[index] =
      !this.legInfo!.isDetailSegmentAmenities[index];
  }
}
