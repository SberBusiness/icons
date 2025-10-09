import test from 'node:test';
import assert from 'node:assert';
import {hash} from '../tools/generator/utils/hash';

test('hash collision test', () => {
    const tokens = [
        "active#E4E8EBdefault#B2B8BF",
        "active#1F1F22default#1F1F22",
        "active#FFFFFFdefault#FFFFFF",
        "active#7D838Adefault#1F1F22",
        "default#21A19Adisabled#B2B8BF",
        "default#E4E8EBdisabled#E4E8EB",
        "default#FFFFFFdisabled#FFFFFF",
        "default#107F8Cdisabled#D0D7DD",
        "default#005E7Fdisabled#D0D7DD",
        "default#107F8Cdisabled#B2B8BF",
        "active#D0D7DDdefault#B2B8BFdisabled#B2B8BF",
        "active#1F1F22default#1F1F22disabled#7D838A",
        "active#FFFFFFdefault#FFFFFFdisabled#FFFFFF",
        "active#7D838Adefault#1F1F22disabled#D0D7DD",
        "active#198CFEdefault#198CFE",
        "active#565B62default#1F1F22",
        "active#E4E8EBdefault#F2F4F7",
        "active#21A19Adefault#B2B8BFhover#21A19A",
        "active#107F8Cdefault#B2B8BFhover#107F8C",
        "active#21A19Adefault#B2B8BFdisabled#565B62hover#21A19A",
        "active#107F8Cdefault#B2B8BFdisabled#D0D7DDhover#107F8C",
        "active#E4E8EBdefault#D0D7DDdisabled#565B62hover#E4E8EB",
        "active#7D838Adefault#B2B8BFdisabled#D0D7DDhover#7D838A",
        "active#D0D7DDdefault#D0D7DDdisabled#565B62hover#E4E8EB",
        "active#565B62default#B2B8BFdisabled#D0D7DDhover#B2B8BF",
        "active#B2B8BFdefault#565B62hover#B2B8BF",
        "active#FFFFFFdefault#D0D7DDhover#FFFFFF",
        "active#E4E8EBdefault#B2B8BFdisabled#565B62hover#E4E8EB",
        "active#21A19Adefault#B2B8BFdisabled#565B62hover#107F8C",
        "active#1358BFdefault#198CFEhover#21A19A",
        "active#0F5498default#1358BFhover#107F8C",
        "active#FF9900default#FF9900hover#FF9900",
        "active#7D838Adefault#B2B8BFdisabled#2D2D30hover#7D838A",
        "active#1F1F22default#1F1F22disabled#565B62hover#1F1F22",
        "active#E4E8EBdefault#F2F4F7disabled#F2F4F7hover#E4E8EB",
        "active#1F1F22default#565B62disabled#D0D7DDhover#1F1F22",
        "active#7D838Adefault#B2B8BFdisabled#565B62hover#7D838A",
        "active#107F8Cdefault#21A19Adisabled#565B62hover#107F8C",
        "active#005E7Fdefault#107F8Cdisabled#90D0CChover#005E7F",
        "active#005E7Fdefault#565B62disabled#565B62hover#005E7F",
        "active#90D0CCdefault#E4E8EBdisabled#F2F4F7hover#90D0CC",
        "active#21A19Adefault#B2B8BF",
        "active#107F8Cdefault#B2B8BF",
        "active#198CFEdefault#B2B8BF",
        "active#1F1F22default#1F1F22disabled#1F1F22hover#1F1F22",
        "active#FFFFFFdefault#FFFFFFdisabled#FFFFFFhover#FFFFFF",
        "active#F2F4F7default#F2F4F7disabled#565B62hover#F2F4F7",
        "active#1F1F22default#1F1F22disabled#D0D7DDhover#1F1F22",
        "active#E4E8EBdefault#7D838Adisabled#565B62hover#E4E8EB",
        "active#2D2D30default#2D2D30disabled#2D2D30hover#2D2D30",
        "active#E4E8EBdefault#E4E8EBdisabled#565B62hover#E4E8EB",
        "active#565B62default#565B62disabled#D0D7DDhover#565B62",
        "active#565B62default#B2B8BFdisabled#E4E8EBhover#565B62",
        "active#FFFFFFdefault#D0D7DDdisabled#565B62hover#FFFFFF",
        "active#E4E8EBdefault#B2B8BFhover#E4E8EB",
        "active#565B62default#7D838Ahover#565B62",
        "active#FFFFFFdefault#FFFFFFdisabled#7D838Ahover#FFFFFF",
        "active#FFFFFFdefault#FFFFFFhover#FFFFFF",
        "active#7D838Adefault#B2B8BFhover#7D838A",
        "active#21A19Adefault#E4E8EBhover#21A19A",
        "active#107F8Cdefault#565B62hover#107F8C",
        "default#FFFFFFhover#FFFFFF",
        "active#1F1F22default#7D838Adisabled#D0D7DDhover#565B62",
        "active#F2F4F7default#B2B8BFdisabled#565B62hover#E4E8EB",
        "default#21A19Ahover#107F8C",
        "default#107F8Chover#005E7F",
        "active#7D838Adefault#565B62hover#7D838A",
        "default#1F1F22hover#1F1F22",
        "default#565B62hover#E4E8EB",
        "default#565B62hover#1F1F22",
        "default#E4E8EBdisabled#565B62",
        "default#FFFFFFdisabled#D0D7DD",
        "active#C11030default#B2B8BFhover#DB1237",
        "active#FFFFFFdefault#1F1F22hover#FFFFFF",
        "active#90D0CCdefault#B2B8BFhover#21A19A",
        "active#1F1F22default#1F1F22hover#FFFFFF",
        "active#107F8Cdefault#B2B8BFhover#21A19A",
        "active#C11030default#565B62hover#DB1237",
        "active#FFFFFFdefault#E4E8EBhover#FFFFFF",
        "active#90D0CCdefault#565B62hover#21A19A",
        "active#1F1F22default#E4E8EBhover#FFFFFF",
        "active#107F8Cdefault#565B62hover#21A19A",
        "default#21A19Adisabled#565B62",
    ];

    // Версии от 0.0.0 до 9.99.9
    const versions = (Array.from({length: 10}, (_, major) =>
        Array.from({length: 100}, (_, minor) =>
            Array.from({length: 10}, (_, patch) => `${major}.${minor}.${patch}`)
        )).flat(2)
    );

    const classNameSet = new Set();
    let collisions = 0;

    for (const version of versions) {
        for (const token of tokens) {
            const className = hash(token + '|' + version);

            if (classNameSet.has(className) === false) {
                classNameSet.add(className);
            } else {
                collisions++;
            }
        }
    }

    assert.strictEqual(collisions, 0);
});
