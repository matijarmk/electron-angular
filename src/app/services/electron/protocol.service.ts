import { Injectable, NgZone } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { remote } from 'electron';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  constructor(private zone: NgZone) {}

  /**
   * Gets deep link argument, extracts url protocol arg
   * @param argv
   * @returns url protocol
   */

  onOpenUrl() {
    let onOpenUrl$: Observable<string | null> = new Observable((subscriber) => {
      this.zone.run(() => {
        subscriber.next(this.getDeepLinkArgument(remote.process.argv));
      });
      remote.app.on('second-instance', (event, argv) => {
        this.zone.run(() => {
          subscriber.next(this.getDeepLinkArgument(argv));
        });
      });

      return () => {
        remote.app.removeAllListeners('second-instance');
      };
    });
    return onOpenUrl$;
  }

  private getDeepLinkArgument(argv: string[]) {
    const deepLink = argv.filter((x) => x.includes('signit'));
    return deepLink.length > 0 ? deepLink[0] : null;
  }
}
